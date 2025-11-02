-- Fix customer_activity_history RLS policy to prevent unlimited public inserts
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can insert customer activity" ON public.customer_activity_history;

-- Create a restrictive policy that blocks direct RLS-level inserts
-- Only Edge Functions with service role keys can insert
CREATE POLICY "Only service role can insert activity" ON public.customer_activity_history
FOR INSERT 
WITH CHECK (false);

-- Fix security definer view by dropping and recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_properties;

-- Recreate the view without SECURITY DEFINER to enforce RLS of the querying user
CREATE VIEW public.public_properties AS
SELECT 
  id,
  title,
  description,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  property_type,
  listing_type,
  features,
  status,
  rental_terms,
  land_size,
  roi_potential,
  amenities,
  rental_duration,
  owner_id,
  created_at,
  updated_at
FROM public.properties
WHERE status = 'available';

-- Grant SELECT permission on the view to authenticated and anonymous users
GRANT SELECT ON public.public_properties TO authenticated, anon;