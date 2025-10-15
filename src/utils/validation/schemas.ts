import { z } from 'zod';

// Search Query Validation Schema
export const searchQuerySchema = z.object({
  query: z.string()
    .min(1, "Search query required")
    .max(500, "Search query too long")
    .trim(),
  user_id: z.string().uuid().nullable(),
  location: z.string().max(100).trim().nullable(),
  property_type: z.enum(['residential', 'commercial', 'undeveloped', 'agricultural']).nullable(),
  price_range: z.object({
    min: z.number().nullable(),
    max: z.number().nullable()
  }).nullable().optional()
});

// Property Alert Validation Schema
export const propertyAlertSchema = z.object({
  user_id: z.string().uuid(),
  location: z.string()
    .min(1, "Location is required")
    .max(200, "Location name too long")
    .trim(),
  property_type: z.enum(['residential', 'commercial', 'undeveloped', 'agricultural']),
  listing_type: z.enum(['sale', 'rent', 'development_partnership']).nullable(),
  min_price: z.number()
    .positive("Price must be positive")
    .max(100000000000, "Price too high")
    .nullable(),
  max_price: z.number()
    .positive("Price must be positive")
    .max(100000000000, "Price too high")
    .nullable(),
  is_active: z.boolean().optional(),
  created_at: z.string().optional()
});

// Investment Calculation Validation Schema
export const investmentCalculationSchema = z.object({
  user_id: z.string().uuid(),
  property_price: z.number()
    .positive("Property price must be positive")
    .max(100000000000, "Price too high"),
  rental_income: z.number()
    .positive("Rental income must be positive")
    .max(10000000, "Rental income too high"),
  property_type: z.string().max(50).trim(),
  location: z.string().max(100).trim(),
  timeframe: z.string().max(20).trim(),
  appreciation_rate: z.number().min(0).max(100),
  calculation_result: z.any()
});

// Contact Form Validation Schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .trim(),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email too long")
    .trim(),
  phone: z.string()
    .max(20, "Phone number too long")
    .regex(/^[0-9+\-\s()]*$/, "Invalid phone number format")
    .nullable()
    .optional(),
  subject: z.string()
    .min(1, "Subject is required")
    .max(200, "Subject too long")
    .trim(),
  message: z.string()
    .min(1, "Message is required")
    .max(2000, "Message too long")
    .trim()
});
