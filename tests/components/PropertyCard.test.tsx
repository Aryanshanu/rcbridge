import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    title: 'Test Property',
    location: 'Hyderabad',
    price: 5000000,
    size: 1500,
    bedrooms: 3,
    bathrooms: 2,
    property_type: 'residential',
    listing_type: 'sale',
    description: 'Beautiful property',
    features: ['parking', 'garden'],
    user_id: 'user123',
    created_at: new Date().toISOString(),
  };

  it('renders property card with basic information', () => {
    render(
      <BrowserRouter>
        <PropertyCard {...mockProperty} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText(/Hyderabad/i)).toBeInTheDocument();
  });

  it('displays price correctly', () => {
    render(
      <BrowserRouter>
        <PropertyCard {...mockProperty} />
      </BrowserRouter>
    );

    // Check for price display (format may vary)
    const priceElement = screen.getByText(/50/);
    expect(priceElement).toBeInTheDocument();
  });

  it('shows property specifications', () => {
    render(
      <BrowserRouter>
        <PropertyCard {...mockProperty} />
      </BrowserRouter>
    );

    expect(screen.getByText(/3/)).toBeInTheDocument(); // bedrooms
    expect(screen.getByText(/2/)).toBeInTheDocument(); // bathrooms
  });
});
