/**
 * Chatbot utilities for RC Bridge real estate assistant
 */

// Combined training data for intent classification
const trainingData = [
  {
    "intent": "home_services_overview",
    "examples": [
      "What does RC Bridge do?",
      "Tell me about your services",
      "How is RC Bridge different?",
      "What are your core services?",
      "What real estate solutions do you offer?"
    ],
    "responses": [
      "RC Bridge offers personalized property matching, rental solutions, startup workspace support, development opportunities, and high-ROI investments — all broker-free and off-market."
    ]
  },
  {
    "intent": "residential_services",
    "examples": [
      "Show me residential properties",
      "Do you have apartments or villas?",
      "I'm looking for a gated community",
      "What kind of homes do you offer?",
      "Can I buy a plot through RC Bridge?"
    ],
    "responses": [
      "We help with premium home buying, apartment leasing, villa transactions, and gated community properties — all curated based on your preferences."
    ]
  },
  {
    "intent": "commercial_services",
    "examples": [
      "Do you have commercial spaces?",
      "I want to lease a retail space",
      "Any office spaces available?",
      "Looking for industrial properties",
      "Searching for warehouse rentals"
    ],
    "responses": [
      "Yes! We provide commercial solutions like office leasing, retail setups, industrial spaces, and warehouse support for businesses of all sizes."
    ]
  },
  {
    "intent": "investment_services",
    "examples": [
      "Where can I invest?",
      "Tell me about your ROI",
      "I'm looking for investment property",
      "Can I earn rental income?",
      "Is there appreciation in value?"
    ],
    "responses": [
      "We offer investment advisory for high-ROI properties (12%+ returns), tailored to your capital and risk profile with market-backed data insights."
    ]
  },
  {
    "intent": "startup_support",
    "examples": [
      "Do you support startups?",
      "Any co-working spaces?",
      "Startup looking for commercial property",
      "Flexible workspace for new business",
      "Need mentorship for property acquisition"
    ],
    "responses": [
      "We help startups find workspaces, co-working hubs, and connect with mentors and investors. Tell us your industry and space requirements!"
    ]
  },
  {
    "intent": "value_proposition",
    "examples": [
      "Why choose RC Bridge?",
      "What makes you unique?",
      "How do you save costs?",
      "Do you list properties publicly?",
      "Do you charge a brokerage?"
    ],
    "responses": [
      "We maintain value by avoiding public listings, use a zero-brokerage model, and provide direct connections between buyers and sellers for full transparency."
    ]
  },
  {
    "intent": "faq_general",
    "examples": [
      "How does it work?",
      "How do I register?",
      "Can I list my property?",
      "Do I need an account?",
      "How is privacy ensured?"
    ],
    "responses": [
      "Just create an account and share your preferences. We'll match you with relevant properties and ensure full confidentiality throughout the process."
    ]
  },
  {
    "intent": "property_matching_process",
    "examples": [
      "How do you match properties?",
      "What's the matching criteria?",
      "Do you use AI for matching?",
      "Can I get personalized deals?"
    ],
    "responses": [
      "Yes! We use preference-based filters to match you with off-market properties. You'll get detailed info only after you confirm interest."
    ]
  },
  {
    "intent": "brokerage_and_fees",
    "examples": [
      "Do you charge any fees?",
      "Is there a brokerage?",
      "How much does it cost?",
      "Any hidden charges?",
      "How do you make money?"
    ],
    "responses": [
      "We operate on a zero-brokerage model. We only charge minimal subscription or service fees based on advanced features or priority access."
    ]
  },
  {
    "intent": "sentiment_positive",
    "examples": [
      "This is helpful",
      "I love the service",
      "You're doing great",
      "Awesome experience",
      "Impressive platform"
    ],
    "responses": [
      "Thank you! We're thrilled to support your real estate journey 💙",
      "Glad to hear that! Let's keep moving toward your dream property."
    ]
  },
  {
    "intent": "sentiment_negative",
    "examples": [
      "Not impressed",
      "I don't get this",
      "This is too slow",
      "I didn't find anything",
      "Feels confusing"
    ],
    "responses": [
      "We're sorry to hear that. Let's improve your search preferences — may I help adjust the filters?",
      "Thanks for your feedback! Let me guide you better this time."
    ]
  },
  {
    "intent": "lead_capture",
    "examples": [
      "I want to sell my property",
      "Looking to buy a villa",
      "Can you help me invest?",
      "Need to rent office space",
      "I'm ready to talk to someone"
    ],
    "responses": [
      "Great! Please share your contact, property type, and location. Our team will assist you shortly.",
      "Thanks! Can you also specify your budget and timeline?"
    ]
  },
  {
    "intent": "end_chat",
    "examples": [
      "That's all",
      "Thank you",
      "I'm done for now",
      "Bye",
      "Catch you later"
    ],
    "responses": [
      "Thanks for connecting with RC Bridge. We're here anytime you need us!",
      "Feel free to reach out if you need anything else. Take care!"
    ]
  },
  {
    "intent": "hyderabad_real_estate_insights",
    "examples": [
      "What's the property rate in Hyderabad?",
      "Tell me about Hyderabad's market trends",
      "Best locations for investment in Hyderabad",
      "Is Gachibowli a good area?",
      "How is Uppal pricing?"
    ],
    "responses": [
      "Hyderabad is one of the fastest-growing real estate markets in India. Areas like Gachibowli, Financial District, and Kokapet show strong appreciation potential. Would you like a personalized property valuation?"
    ]
  },
  {
    "intent": "roi_calculation_tool",
    "examples": [
      "How do I calculate ROI?",
      "Can you help with rental yield?",
      "What is the ROI if I invest 1 crore?",
      "How much will I earn from this investment?",
      "Is 12% ROI guaranteed?"
    ],
    "responses": [
      "RC Bridge provides curated properties with over 12% annual ROI, combining rental income + appreciation. I can show a sample calculation for a ₹1Cr investment if you'd like."
    ]
  },
  {
    "intent": "developer_support",
    "examples": [
      "Can developers use your platform?",
      "Do you help with land acquisition?",
      "What if I want to build apartments?",
      "Any leads for construction projects?",
      "How do you assist builders?"
    ],
    "responses": [
      "Yes, RC Bridge works with real estate developers to find land, investors, and manage end-to-end deals. We also support marketing to premium buyers."
    ]
  },
  {
    "intent": "rc_bridge_impact",
    "examples": [
      "How many deals have you done?",
      "What's your market credibility?",
      "How much have you saved?",
      "Do people trust RC Bridge?",
      "How long have you been active?"
    ],
    "responses": [
      "We've facilitated ₹200 Cr+ worth of deals, helped clients save over ₹20 Cr in brokerage, and preserved ₹4.5 Cr+ in value by avoiding overexposure — built over 10+ years of market expertise."
    ]
  },
  {
    "intent": "personalized_services_info",
    "examples": [
      "What's personalized property matching?",
      "How do you match buyers and sellers?",
      "What makes your service unique?",
      "Why don't you list properties online?",
      "How are you different from MagicBricks?"
    ],
    "responses": [
      "We don't publicly list properties. Instead, we take your preferences and match you with curated off-market deals, preserving exclusivity and increasing property value. Think quality over quantity!"
    ]
  },
  {
    "intent": "post_sale_support",
    "examples": [
      "Do you help after the sale?",
      "What if I want to rent it later?",
      "Do you provide resale support?",
      "Can you manage my property?",
      "How do I get post-sale assistance?"
    ],
    "responses": [
      "Yes! RC Bridge provides post-sale support including rental listing, resale strategies, and connection to property management providers."
    ]
  },
  {
    "intent": "contact_and_demo",
    "examples": [
      "I want a demo",
      "How can I contact your team?",
      "Can I schedule a call?",
      "Is there a WhatsApp support?",
      "Need help from your expert"
    ],
    "responses": [
      "We're happy to help! You can book a demo or connect with us via email at aryan@rcbridge.co or use the Contact section on our website."
    ]
  },
  {
    "intent": "user_role_identification",
    "examples": [
      "I'm a builder",
      "I am an investor",
      "I want to rent an office",
      "I'm a startup founder",
      "I want to list my home"
    ],
    "responses": [
      "Welcome! Let's begin by understanding your needs. Are you looking to buy, sell, rent, or invest? I'll tailor recommendations accordingly."
    ]
  }
];

// Legacy knowledge base (keeping for backward compatibility)
const knowledgeBase = {
  greetings: [
    "Hello! I'm your RC Bridge real estate assistant. How can I help you today?",
    "Welcome to RC Bridge! I'm here to help with your real estate needs.",
    "Hi there! Looking for property information or investment advice? I'm here to assist."
  ],
  properties: [
    "We have a variety of properties available in Hyderabad, from luxury villas in Jubilee Hills to affordable apartments in HITEC City.",
    "Our listings include residential, commercial, and agricultural properties across Hyderabad and surrounding areas.",
    "RC Bridge specializes in premium real estate in prime locations of Hyderabad with excellent investment potential."
  ],
  investment: [
    "Real estate in Hyderabad has shown consistent appreciation of 8-12% annually over the past 5 years.",
    "Commercial properties in HITEC City currently offer rental yields between 4-6%, making them attractive investment options.",
    "Residential plots in developing areas like Kokapet have seen up to 20% appreciation in the last 2 years."
  ],
  financing: [
    "We partner with leading banks offering home loans starting at 7.2% interest rates.",
    "Investment properties can be financed with up to 70% loan-to-value ratio through our banking partners.",
    "Our mortgage advisors can help structure your financing to optimize tax benefits and cash flow."
  ],
  locations: [
    "Jubilee Hills and Banjara Hills are premium residential areas with excellent amenities and appreciation potential.",
    "HITEC City and Financial District are ideal for commercial investments with high rental demand.",
    "Developing areas like Kokapet and Tellapur offer good entry points for long-term investment."
  ],
  process: [
    "Our buying process includes property selection, due diligence, and connecting you with the right sellers.",
    "For sellers, we provide valuation services, marketing, and qualified buyer screening.",
    "RC Bridge connects buyers and sellers directly for a more efficient transaction experience."
  ]
};

// Sample properties for quick responses
const sampleProperties = [
  {
    id: "1",
    title: "Luxury Villa in Jubilee Hills",
    location: "Jubilee Hills, Hyderabad",
    price: "₹4.85 Cr",
    description: "Magnificent 4-bedroom villa with private garden, swimming pool, and smart home features."
  },
  {
    id: "2", 
    title: "Premium Apartment",
    location: "Banjara Hills, Hyderabad",
    price: "₹2.45 Cr",
    description: "Elegant 3-bedroom apartment in a gated community with clubhouse, gym, and 24/7 security."
  },
  {
    id: "3",
    title: "Commercial Building",
    location: "HITEC City, Hyderabad",
    price: "₹16.8 Cr",
    description: "Modern office space with premium finishes, ample parking, and excellent connectivity."
  },
  {
    id: "4",
    title: "Agricultural Land",
    location: "Shankarpally, Hyderabad Outskirts",
    price: "₹1.2 Cr per acre",
    description: "Fertile farmland with water source, ideal for organic farming or farmhouse development."
  }
];

// User conversation history
let conversationContext: string[] = [];

/**
 * Initializes the chat model - simplified for reliability
 */
export async function initializeChatModel(): Promise<boolean> {
  try {
    console.log('Initializing chat capabilities...');
    // Simulating successful initialization
    return true;
  } catch (error) {
    console.error('Error initializing chat capabilities:', error);
    return false;
  }
}

/**
 * Initializes the image generation capability
 */
export async function initializeImageModel(): Promise<boolean> {
  try {
    console.log('Initializing image generation capabilities...');
    // Simulating successful initialization
    return true;
  } catch (error) {
    console.error('Failed to initialize image generation:', error);
    return false;
  }
}

/**
 * Find matching intent from training data
 */
function findIntent(message: string): { intent: string, response: string } | null {
  // Convert message to lowercase for case-insensitive matching
  const normalizedMessage = message.toLowerCase();
  
  // Check each intent in the training data
  for (const intentData of trainingData) {
    for (const example of intentData.examples) {
      // Simple word matching (can be enhanced with NLP techniques)
      const exampleWords = example.toLowerCase().split(/\s+/);
      const messageWords = normalizedMessage.split(/\s+/);
      
      // Check if key words from the example appear in the message
      const matchingWords = exampleWords.filter(word => 
        word.length > 3 && messageWords.includes(word)
      );
      
      // If there are enough matching words, return this intent
      if (matchingWords.length >= 2 || 
          (exampleWords.length < 4 && matchingWords.length >= 1)) {
        // Get a random response for this intent
        const response = intentData.responses[Math.floor(Math.random() * intentData.responses.length)];
        return { intent: intentData.intent, response };
      }
    }
  }
  
  return null;
}

/**
 * Legacy intent analysis (as fallback)
 */
function analyzeIntent(message: string): string {
  message = message.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('greetings')) {
    return 'greeting';
  } else if (message.includes('property') || message.includes('house') || message.includes('apartment') || message.includes('villa') || message.includes('flat')) {
    return 'property';
  } else if (message.includes('invest') || message.includes('return') || message.includes('appreciation') || message.includes('yield')) {
    return 'investment';
  } else if (message.includes('loan') || message.includes('mortgage') || message.includes('finance') || message.includes('bank')) {
    return 'financing';
  } else if (message.includes('location') || message.includes('area') || message.includes('neighborhood') || message.includes('jubilee') || message.includes('banjara') || message.includes('hitech')) {
    return 'location';
  } else if (message.includes('process') || message.includes('buying') || message.includes('selling') || message.includes('documents')) {
    return 'process';
  } else if (message.includes('agricultural') || message.includes('farm') || message.includes('land')) {
    return 'agricultural';
  } else {
    return 'general';
  }
}

/**
 * Generate a response based on user message and context
 */
export async function generateResponse(message: string): Promise<string> {
  try {
    // Add message to context for better continuity
    conversationContext.push(message);
    if (conversationContext.length > 5) {
      conversationContext.shift(); // Keep only recent context
    }
    
    // First try to match from the training data
    const intentMatch = findIntent(message);
    
    if (intentMatch) {
      console.log(`Found intent match: ${intentMatch.intent}`);
      return intentMatch.response;
    }
    
    // If no match, fall back to the legacy intent analysis
    console.log('No intent match found, using legacy analysis');
    const intent = analyzeIntent(message);
    let response = '';
    
    // Generate contextual responses based on intent
    switch (intent) {
      case 'greeting':
        response = knowledgeBase.greetings[Math.floor(Math.random() * knowledgeBase.greetings.length)];
        response += "\n\nAre you looking to buy, sell, or invest in properties? I can provide information about available properties, market trends, and connect you with the right opportunities.";
        break;
      case 'property':
        // If asking about specific property features
        if (message.includes('bedroom') || message.includes('bath') || message.includes('sq ft') || message.includes('size')) {
          response = "We have properties ranging from 2-bedroom apartments to 5-bedroom luxury villas. The sizes range from 1200 sq ft to 8000+ sq ft depending on the type and location. Would you like me to recommend properties based on specific requirements?";
        } else {
          // General property information
          response = knowledgeBase.properties[Math.floor(Math.random() * knowledgeBase.properties.length)];
          // Add a sample property recommendation
          const randomProperty = sampleProperties[Math.floor(Math.random() * 3)]; // Exclude agricultural for general property queries
          response += `\n\nFor example, we have a "${randomProperty.title}" in ${randomProperty.location} priced at ${randomProperty.price}. ${randomProperty.description}`;
        }
        break;
      case 'agricultural':
        const agriProperty = sampleProperties[3]; // Agricultural property
        response = `We have several agricultural property options available. For example, we have "${agriProperty.title}" in ${agriProperty.location} priced at ${agriProperty.price}. ${agriProperty.description}\n\nAre you looking for any specific features in agricultural land?`;
        break;
      case 'investment':
        response = knowledgeBase.investment[Math.floor(Math.random() * knowledgeBase.investment.length)];
        response += "\n\nWould you like to learn more about specific investment opportunities or ROI calculations?";
        break;
      case 'financing':
        response = knowledgeBase.financing[Math.floor(Math.random() * knowledgeBase.financing.length)];
        response += "\n\nI can connect you with our finance experts for personalized advice if you're interested.";
        break;
      case 'location':
        response = knowledgeBase.locations[Math.floor(Math.random() * knowledgeBase.locations.length)];
        response += "\n\nDo you have a specific area of Hyderabad in mind for your property search?";
        break;
      case 'process':
        response = knowledgeBase.process[Math.floor(Math.random() * knowledgeBase.process.length)];
        response += "\n\nWould you like to tell me more about what you're looking for so I can help you get started?";
        break;
      default:
        // Check for questions about price ranges
        if (message.includes('price') || message.includes('cost') || message.includes('budget') || message.includes('afford')) {
          response = "Our properties range from ₹80 lakhs for apartments in developing areas to ₹20+ crores for luxury villas in premium localities. Commercial properties start at ₹2 crores. What budget range are you considering?";
        } 
        // Check for timing-related questions
        else if (message.includes('when') || message.includes('how long') || message.includes('time') || message.includes('duration')) {
          response = "The typical property transaction through RC Bridge takes about 30-45 days from selection to possession. Premium properties might involve customized timelines based on your requirements. How soon are you looking to move forward?";
        }
        // General fallback response
        else {
          response = "I'd be happy to help you with information about properties in Hyderabad, investment opportunities, financing options, or the buying/selling process. Could you please tell me more about what you're looking for?";
        }
    }
    
    return response;
  } catch (error) {
    console.error('Error generating chat response:', error);
    return "I'm currently experiencing technical difficulties. Please try again in a moment, or reach out to our customer service at support@rcbridge.com.";
  }
}

/**
 * Store user inquiry data
 */
export function storeUserInquiry(message: string, context: string[] = []): void {
  try {
    // In a real application, this would save to a database or local storage
    const inquiry = {
      message,
      context,
      timestamp: new Date().toISOString()
    };
    
    // For now, just storing in localStorage for demonstration
    const existingInquiries = JSON.parse(localStorage.getItem('userInquiries') || '[]');
    existingInquiries.push(inquiry);
    localStorage.setItem('userInquiries', JSON.stringify(existingInquiries));
    
    console.log('Stored user inquiry:', inquiry);
  } catch (error) {
    console.error('Error storing user inquiry:', error);
  }
}

/**
 * Generate a property image based on text description
 */
export async function generatePropertyImage(description: string): Promise<string> {
  try {
    console.log('Generating image for:', description);
    
    // For now, return placeholder images based on the description
    if (description.toLowerCase().includes('villa') || description.toLowerCase().includes('luxury')) {
      return '/assets/placeholders/luxury-villa.jpg';
    } else if (description.toLowerCase().includes('apartment') || description.toLowerCase().includes('flat')) {
      return '/assets/placeholders/apartment.jpg';
    } else if (description.toLowerCase().includes('commercial') || description.toLowerCase().includes('office')) {
      return '/assets/placeholders/commercial.jpg';
    } else if (description.toLowerCase().includes('agricultural') || description.toLowerCase().includes('farm') || description.toLowerCase().includes('land')) {
      return '/assets/placeholders/agricultural.jpg';
    } else {
      return '/placeholder.svg';
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return '/placeholder.svg';
  }
}

// Export the conversationContext for persistence
export function getConversationContext(): string[] {
  return [...conversationContext];
}

export function clearConversationContext(): void {
  conversationContext = [];
}
