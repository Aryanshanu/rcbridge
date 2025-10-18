export const testUsers = {
  regular: {
    email: 'test@rcbridge.co',
    password: 'Test123!@#',
    name: 'Test User',
  },
  admin: {
    email: 'admin@rcbridge.co',
    password: 'Admin123!@#',
    name: 'Admin User',
  },
};

export const testProperties = {
  residential: {
    title: 'Test Residential Property',
    location: 'Hyderabad, Telangana',
    price: 5000000,
    size: 1500,
    landSize: 2000,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'residential',
    listingType: 'sale',
    description: 'Beautiful residential property for testing',
    features: ['parking', 'garden'],
  },
  commercial: {
    title: 'Test Commercial Property',
    location: 'Hyderabad, Telangana',
    price: 10000000,
    size: 3000,
    landSize: 4000,
    propertyType: 'commercial',
    listingType: 'sale',
    description: 'Prime commercial space for testing',
    features: ['parking', 'elevator'],
  },
};

export const testContactForms = {
  valid: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    subject: 'Test Inquiry',
    message: 'This is a test message for the contact form.',
  },
  invalid: {
    name: '',
    email: 'invalid-email',
    message: '',
  },
};

export const testSearchQueries = {
  location: 'Hyderabad',
  propertyType: 'residential',
  minPrice: 1000000,
  maxPrice: 10000000,
  bedrooms: 3,
};
