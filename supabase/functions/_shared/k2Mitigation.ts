/**
 * K2-Think LLM-Assisted Mitigation System
 * Analyzes errors and proposes safe automated fixes
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

export interface MitigationResult {
  analysis: string;
  suggestedFix: any;
  confidence: number; // 0.0 to 1.0
  autoApplicable: boolean;
  reasoning: string;
}

/**
 * Analyze error using K2-Think and propose mitigation
 */
export async function runK2Mitigation(
  errorContext: {
    action: string;
    errorMessage: string;
    errorType: string;
    payload?: any;
    metadata?: any;
  },
  supabaseUrl: string,
  supabaseKey: string
): Promise<MitigationResult> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const prompt = `You are an expert system debugger. Analyze this error and propose a safe automated fix.

Error Context:
- Action: ${errorContext.action}
- Error Type: ${errorContext.errorType}
- Error Message: ${errorContext.errorMessage}
- Payload: ${JSON.stringify(errorContext.payload, null, 2)}
- Metadata: ${JSON.stringify(errorContext.metadata, null, 2)}

Analysis Rules:
1. Identify the root cause
2. Propose ONLY safe automated fixes (no data deletion, no security changes)
3. If the fix requires manual intervention, set autoApplicable: false
4. Assign confidence score (0.0-1.0) based on fix safety and certainty

Examples of SAFE automated fixes:
- Normalizing phone numbers (remove spaces, add country code)
- Converting price formats (Crores to numbers)
- Filling missing required fields from description text
- Correcting data types (string → number)
- Mapping property types to valid enum values

Examples of UNSAFE fixes (set autoApplicable: false):
- Deleting data
- Changing RLS policies
- Modifying authentication
- Altering database schema

Return JSON:
{
  "analysis": "Brief explanation of the error",
  "suggestedFix": { /* The fix to apply */ },
  "confidence": 0.85,
  "autoApplicable": true/false,
  "reasoning": "Why this fix is safe and correct"
}`;

  try {
    const { data, error } = await supabase.functions.invoke('ai-reasoning-k2', {
      body: {
        query: prompt,
        context: errorContext,
      },
    });

    if (error || !data) {
      console.error('[k2Mitigation] K2-Think call failed:', error);
      return {
        analysis: 'Failed to analyze error',
        suggestedFix: null,
        confidence: 0.0,
        autoApplicable: false,
        reasoning: 'AI reasoning unavailable',
      };
    }

    // Parse K2-Think response
    const reasoning = data.reasoning || '';

    // Extract JSON from reasoning text
    const jsonMatch = reasoning.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        analysis: parsed.analysis || '',
        suggestedFix: parsed.suggestedFix || null,
        confidence: parsed.confidence || 0.0,
        autoApplicable: parsed.autoApplicable || false,
        reasoning: parsed.reasoning || '',
      };
    }

    return {
      analysis: reasoning,
      suggestedFix: null,
      confidence: 0.0,
      autoApplicable: false,
      reasoning: 'Could not extract structured mitigation from AI response',
    };
  } catch (error) {
    console.error('[k2Mitigation] Exception:', error);
    return {
      analysis: 'Exception during mitigation analysis',
      suggestedFix: null,
      confidence: 0.0,
      autoApplicable: false,
      reasoning: (error as Error).message,
    };
  }
}

/**
 * Apply mitigation if safe and high confidence
 */
export async function applyMitigationIfSafe(
  mitigation: MitigationResult,
  applyFn: (fix: any) => Promise<boolean>
): Promise<{ applied: boolean; reason: string }> {
  if (!mitigation.autoApplicable) {
    return { applied: false, reason: 'Mitigation requires manual intervention' };
  }

  if (mitigation.confidence < 0.8) {
    return { applied: false, reason: `Confidence too low: ${mitigation.confidence}` };
  }

  if (!mitigation.suggestedFix) {
    return { applied: false, reason: 'No fix suggested' };
  }

  try {
    const success = await applyFn(mitigation.suggestedFix);
    return {
      applied: success,
      reason: success ? 'Fix applied successfully' : 'Fix application failed',
    };
  } catch (error) {
    return { applied: false, reason: `Exception: ${(error as Error).message}` };
  }
}
