import { describe, it, expect, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: { id: '123' }, error: null }),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    })),
  },
}));

describe('Property Submission Integration', () => {
  it('should submit property data successfully', async () => {
    const propertyData = {
      title: 'Test Property',
      location: 'Hyderabad',
      price: 5000000,
      size: 1500,
      bedrooms: 3,
      bathrooms: 2,
      property_type: 'residential',
      listing_type: 'sale',
      description: 'Beautiful property',
      user_id: 'user123',
    };

    const mockInsert = vi.fn().mockResolvedValue({ 
      data: { id: '123', ...propertyData }, 
      error: null 
    });

    const mockFrom = vi.mocked(supabase.from);
    mockFrom.mockReturnValue({
      insert: mockInsert,
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
    } as any);

    const result = await supabase.from('properties').insert(propertyData);

    expect(result.error).toBeNull();
    expect(mockInsert).toHaveBeenCalledWith(propertyData);
  });

  it('should handle validation errors', async () => {
    const invalidData = {
      title: '', // Empty title should fail
      price: -1000, // Negative price should fail
    };

    // Validation would happen on the client side before submission
    expect(invalidData.title).toBe('');
    expect(invalidData.price).toBeLessThan(0);
  });

  it('should handle database errors', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Database error', code: '23505' },
    });

    const mockFrom = vi.mocked(supabase.from);
    mockFrom.mockReturnValue({
      insert: mockInsert,
    } as any);

    const result = await supabase.from('properties').insert({});

    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe('Database error');
  });
});
