import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { extractPropertyWithK2 } from "../_shared/k2PropertyExtractor.ts";
import { normalizeProperty } from "../_shared/dataNormalizer.ts";
import { checkDuplicates } from "../_shared/duplicateChecker.ts";
import { sanitizeError, logErrorSecurely } from "../_shared/errorSanitizer.ts";
import { Logger } from "../_shared/logger.ts";
import { extractTraceContext, withSpan } from "../_shared/tracer.ts";
import { runK2Mitigation, applyMitigationIfSafe } from "../_shared/k2Mitigation.ts";

const logger = new Logger('import-instagram-properties');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InstagramPost {
  text: string;
  url?: string;
  handle?: string;
  images?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { traceId, spanId } = extractTraceContext(req);
  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: roleData } = await supabaseClient.from("user_roles").select("role").eq("user_id", user.id).single();
    if (!roleData || roleData.role !== "admin") {
      await logger.warn('admin_access_denied', traceId, {
        user_id: user.id,
        user_email: user.email,
        action: 'import_instagram_properties'
      });
      return new Response(JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { posts } = await req.json();
    if (!Array.isArray(posts) || posts.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid request: posts array required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    console.log(`[import-instagram] Starting import for ${posts.length} posts by user ${user.email}`);
    await logger.info('import_started', traceId, { 
      user_id: user.id, 
      user_email: user.email,
      post_count: posts.length 
    });

    const { data: job, error: jobError } = await supabaseClient.from("scraping_jobs").insert({
      platform: "instagram", status: "processing", triggered_by: user.id,
      properties_found: posts.length, started_at: new Date().toISOString(), import_data: { posts },
    }).select().single();

    if (jobError || !job) {
      logErrorSecurely("import-instagram", jobError, { user_id: user.id });
      return new Response(JSON.stringify({ error: sanitizeError(jobError) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    console.log(`[import-instagram] Created job ${job.id}`);

    const processedRecords = [];
    let k2CallCount = 0;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i] as InstagramPost;
      try {
        console.log(`[import-instagram] Processing post ${i + 1}/${posts.length}`);
        const extractionResult = await extractPropertyWithK2(post.text, supabaseUrl, supabaseAnonKey);
        k2CallCount++;

        if (!extractionResult.extracted || extractionResult.errors.length > 0) {
          console.error(`[import-instagram] K2-Think extraction failed for post ${i + 1}:`, extractionResult.errors);
          
          // Phase 4: LLM Self-Healing - Attempt mitigation
          await logger.error('extraction_failed', traceId, new Error(extractionResult.errors.join(', ')), {
            post_index: i,
            post_text_preview: post.text.substring(0, 100)
          });

          const mitigation = await runK2Mitigation({
            action: 'instagram_import_extraction_failed',
            errorMessage: extractionResult.errors.join(', '),
            errorType: 'ExtractionError',
            payload: { post_text: post.text, post_index: i },
            metadata: { job_id: job.id }
          }, supabaseUrl, serviceRoleKey);

          await logger.log({
            action: 'extraction_mitigation_attempted',
            traceId,
            spanId,
            severity: 'WARN',
            payload: { post_index: i },
            metadata: { llm_reasoning: mitigation }
          });

          // Try to apply fix if confidence > 0.8
          let mitigationApplied = false;
          if (mitigation.confidence > 0.8 && mitigation.autoApplicable) {
            const { applied } = await applyMitigationIfSafe(mitigation, async (fix) => {
              try {
                const retryResult = await extractPropertyWithK2(
                  fix.correctedText || post.text, 
                  supabaseUrl, 
                  supabaseAnonKey
                );
                if (retryResult.extracted) {
                  extractionResult.extracted = retryResult.extracted;
                  extractionResult.errors = [];
                  mitigationApplied = true;
                  return true;
                }
              } catch (e) {
                console.error('Mitigation retry failed:', e);
              }
              return false;
            });

            if (applied) {
              await logger.info('extraction_auto_fixed', traceId, {
                post_index: i,
                auto_fixed: true,
                mitigation_confidence: mitigation.confidence
              });
            }
          }

          if (!mitigationApplied) {
            processedRecords.push({ index: i, raw_text: post.text, status: "error", errors: extractionResult.errors, warnings: extractionResult.warnings });
            continue;
          }
        }

        const { normalized, warnings: normWarnings, errors: normErrors } = normalizeProperty({
          ...extractionResult.extracted, source_url: post.url, source_instagram_handle: post.handle,
          source_contact_phone: extractionResult.extracted.contact_phone,
          source_contact_email: extractionResult.extracted.contact_email,
          source_contact_name: extractionResult.extracted.contact_name,
        });

        if (normErrors.length > 0) {
          console.error(`[import-instagram] Normalization failed for post ${i + 1}:`, normErrors);
          processedRecords.push({
            index: i, raw_text: post.text, status: "error",
            errors: [...extractionResult.errors, ...normErrors],
            warnings: [...extractionResult.warnings, ...normWarnings],
          });
          continue;
        }

        const duplicateResult = await checkDuplicates({
          source_url: post.url, location: normalized.location, price: normalized.price,
          area: normalized.area, source_contact_phone: normalized.source_contact_phone,
          source_contact_email: normalized.source_contact_email, title: normalized.title,
        }, supabaseClient);

        const allWarnings = [...extractionResult.warnings, ...normWarnings];
        if (duplicateResult.isDuplicate) {
          allWarnings.push(`Possible duplicate detected (${(duplicateResult.highestConfidence * 100).toFixed(0)}% confidence)`);
        }

        processedRecords.push({
          index: i, raw_text: post.text,
          raw_data: { text: post.text, url: post.url, handle: post.handle, k2_response: extractionResult.rawResponse },
          property: { ...normalized, images: post.images || [] },
          status: normErrors.length > 0 ? "error" : allWarnings.length > 0 ? "warning" : "valid",
          warnings: allWarnings, errors: normErrors,
          duplicate: duplicateResult.isDuplicate ? {
            confidence: duplicateResult.highestConfidence,
            matches: duplicateResult.matches.map((m) => ({ id: m.id, confidence: m.confidence, reason: m.reason, existing: m.existingProperty })),
          } : null,
          confidence: extractionResult.confidence,
        });

        console.log(`[import-instagram] Post ${i + 1} processed: ${processedRecords[processedRecords.length - 1].status}`);
        if (i < posts.length - 1) {
          console.log(`[import-instagram] Waiting 12s before next K2-Think call (rate limit)...`);
          await new Promise((resolve) => setTimeout(resolve, 12000));
        }
      } catch (error) {
        console.error(`[import-instagram] Error processing post ${i + 1}:`, error);
        processedRecords.push({
          index: i, raw_text: post.text, status: "error",
          errors: [error instanceof Error ? error.message : "Unknown error"], warnings: [],
        });
      }
    }

    const validCount = processedRecords.filter((r) => r.status === "valid").length;
    const warningCount = processedRecords.filter((r) => r.status === "warning").length;
    const errorCount = processedRecords.filter((r) => r.status === "error").length;
    const duplicateCount = processedRecords.filter((r) => r.duplicate).length;

    await supabaseClient.from("scraping_jobs").update({
      status: "pending_review", k2_calls: k2CallCount, duplicates_found: duplicateCount,
    }).eq("id", job.id);

    console.log(`[import-instagram] Processing complete: ${validCount} valid, ${warningCount} warnings, ${errorCount} errors, ${duplicateCount} duplicates`);
    
    await logger.info('import_completed', traceId, {
      job_id: job.id,
      total: posts.length,
      valid: validCount,
      warnings: warningCount,
      errors: errorCount,
      duplicates: duplicateCount,
      k2_calls: k2CallCount,
      duration_ms: Date.now() - startTime
    });

    return new Response(JSON.stringify({
      success: true, job_id: job.id, records: processedRecords,
      summary: { total: posts.length, valid: validCount, warnings: warningCount, errors: errorCount, duplicates: duplicateCount },
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[import-instagram] Fatal error:", error);
    await logger.critical('import_failed', traceId, error as Error, {
      duration_ms: Date.now() - startTime
    });
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
