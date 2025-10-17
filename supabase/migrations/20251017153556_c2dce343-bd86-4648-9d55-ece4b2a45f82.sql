-- Add missing RLS policies for contact_messages table to allow admin management

-- Allow admins to update contact messages (e.g., mark as resolved, add notes)
CREATE POLICY "admins_can_update_contact_messages"
ON public.contact_messages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete spam or test messages
CREATE POLICY "admins_can_delete_contact_messages"
ON public.contact_messages
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));