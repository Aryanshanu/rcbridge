import { supabase } from "@/integrations/supabase/client";

type ActivityType = 
  | 'contact_form' 
  | 'assistance_request' 
  | 'property_inquiry' 
  | 'chat_conversation' 
  | 'profile_update' 
  | 'search_query';

interface ActivityDetails {
  [key: string]: any;
}

/**
 * Logs customer activity to the database for admin tracking
 * @param activityType - Type of activity being logged
 * @param activityDetails - Details specific to the activity type
 * @param customerInfo - Optional customer information (id, email, name)
 */
export async function logActivity(
  activityType: ActivityType,
  activityDetails: ActivityDetails,
  customerInfo?: {
    customer_id?: string;
    customer_email?: string;
    customer_name?: string;
  }
) {
  try {
    const { data, error } = await supabase.functions.invoke('log-customer-activity', {
      body: {
        customer_id: customerInfo?.customer_id,
        customer_email: customerInfo?.customer_email,
        customer_name: customerInfo?.customer_name,
        activity_type: activityType,
        activity_details: activityDetails,
      }
    });

    if (error) {
      console.error('Failed to log activity:', error);
      return false;
    }

    console.log(`Activity logged: ${activityType}`, activityDetails);
    return true;
  } catch (error) {
    console.error('Error logging activity:', error);
    return false;
  }
}
