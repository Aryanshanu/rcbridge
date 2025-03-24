
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/user";

// Pre-defined invite codes with role assignments
const INVITE_CODES = [
  { code: "ADMIN-123456", role: "admin", expiryDate: "2025-12-31", used: false },
  { code: "DEV-789012", role: "developer", expiryDate: "2025-12-31", used: false },
  { code: "MAINT-345678", role: "maintainer", expiryDate: "2025-12-31", used: false },
  { code: "ADMIN-987654", role: "admin", expiryDate: "2025-12-31", used: false },
  { code: "DEV-654321", role: "developer", expiryDate: "2025-12-31", used: false },
  { code: "MAINT-111222", role: "maintainer", expiryDate: "2025-12-31", used: false },
  { code: "ADMIN-333444", role: "admin", expiryDate: "2025-12-31", used: false },
  { code: "DEV-555666", role: "developer", expiryDate: "2025-12-31", used: false },
  { code: "MAINT-777888", role: "maintainer", expiryDate: "2025-12-31", used: false },
  { code: "ADMIN-999000", role: "admin", expiryDate: "2025-12-31", used: false }
];

// Function to validate invite code
export const validateInviteCode = (code: string) => {
  // Find the invite code in our list
  const inviteCode = INVITE_CODES.find(
    (invite) => invite.code === code && !invite.used
  );

  // If code not found or already used
  if (!inviteCode) {
    return {
      valid: false,
      message: "Invalid or already used invite code",
      role: null
    };
  }

  // Check if code has expired
  const expiryDate = new Date(inviteCode.expiryDate);
  if (expiryDate < new Date()) {
    return {
      valid: false,
      message: "This invite code has expired",
      role: null
    };
  }

  // Mark code as valid and return role
  return {
    valid: true,
    message: "Invite code valid",
    role: inviteCode.role as UserRole
  };
};

// Function to register a new user with an invite code
export const registerWithInviteCode = async (
  email: string,
  password: string,
  inviteCode: string,
  fullName?: string
) => {
  try {
    // Validate the invite code first
    const validation = validateInviteCode(inviteCode);
    
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message
      };
    }

    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || "",
        }
      }
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      return {
        success: false,
        message: "Registration failed. Please try again."
      };
    }

    // Update the user's role based on the invite code
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        role: validation.role,
        invite_used: inviteCode
      })
      .eq("id", authData.user.id);

    if (updateError) {
      console.error("Error updating user role:", updateError);
      return {
        success: false,
        message: "Account created but role assignment failed."
      };
    }

    // Mark invite code as used (this would typically be done in the database)
    const codeIndex = INVITE_CODES.findIndex(item => item.code === inviteCode);
    if (codeIndex >= 0) {
      INVITE_CODES[codeIndex].used = true;
    }

    return {
      success: true,
      message: "Registration successful",
      user: authData.user
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during registration"
    };
  }
};

// Get the current user's role
export const getUserRole = async (): Promise<UserRole | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    // Get the user's profile with role information
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    if (error || !data) {
      console.error("Error fetching user role:", error);
      return null;
    }
    
    return data.role as UserRole;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

// Function to trigger Apify scraper for Instagram properties
export const triggerApifyScraper = async (scraperType: string) => {
  try {
    // In a real implementation, this would make an API call to trigger Apify
    console.log(`Triggering ${scraperType} scraper...`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      message: `${scraperType} scraper triggered successfully`
    };
  } catch (error) {
    console.error(`Error triggering ${scraperType} scraper:`, error);
    throw error;
  }
};

// The function to implement your Instagram property scraping
export const scrapeInstagramProperties = async (instagramProfiles: string[], maxPosts = 20) => {
  try {
    console.log(`Starting to scrape profiles: ${instagramProfiles.join(', ')}`);
    
    // This would be a real API call to your Apify scraper
    // For demo purposes, we're simulating the response
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return mock scraped data
    return {
      success: true,
      message: "Properties scraped successfully",
      properties: [
        {
          property_description: "Beautiful apartment in city center, 2 bedrooms with amazing view. #realestate #property #apartment",
          price: 155000,
          property_type: "apartment",
          location: "Hyderabad",
          image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          instagram_post_url: "https://instagram.com/p/sample1",
          hashtags: ["realestate", "property", "apartment"],
          likes: 120,
          comments: 15
        },
        {
          property_description: "Luxury villa with swimming pool and garden area. Great investment opportunity! #luxury #villa #investment",
          price: 380000,
          property_type: "villa",
          location: "Jubilee Hills",
          image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
          instagram_post_url: "https://instagram.com/p/sample2",
          hashtags: ["luxury", "villa", "investment"],
          likes: 250,
          comments: 32
        },
        {
          property_description: "Commercial space available in prime location. Perfect for office or retail. #commercial #office #retail",
          price: 220000,
          property_type: "commercial",
          location: "Banjara Hills",
          image_url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
          instagram_post_url: "https://instagram.com/p/sample3",
          hashtags: ["commercial", "office", "retail"],
          likes: 85,
          comments: 10
        }
      ]
    };
  } catch (error) {
    console.error("Error scraping Instagram properties:", error);
    throw error;
  }
};

// Function to store scraped properties in Supabase
export const storeScrapedProperties = async (properties: any[]) => {
  try {
    // Insert properties into Supabase with conflict handling for duplicates
    const { data, error } = await supabase
      .from("properties")
      .upsert(properties, { 
        onConflict: "instagram_post_url", 
        ignoreDuplicates: true 
      });
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      message: "Properties stored successfully",
      count: properties.length
    };
  } catch (error) {
    console.error("Error storing properties:", error);
    throw error;
  }
};
