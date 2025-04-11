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

// Specific location-based properties to provide more relevant responses
const locationBasedProperties = {
  "pocharam": [
    {
      id: "p1",
      title: "Modern Apartment in Pocharam",
      location: "Pocharam, Hyderabad",
      price: "₹72 Lakhs",
      description: "Spacious 2-bedroom apartment in a gated community with amenities like swimming pool, gym, and children's play area."
    },
    {
      id: "p2",
      title: "Independent House in Pocharam",
      location: "Pocharam, Hyderabad",
      price: "₹1.2 Cr",
      description: "Beautiful 3-bedroom independent house with garden space, modern interiors, and close to IT parks."
    }
  ],
  "gachibowli": [
    {
      id: "g1",
      title: "Premium Apartment in Gachibowli",
      location: "Gachibowli, Hyderabad",
      price: "₹1.45 Cr",
      description: "Luxurious 3-bedroom apartment with premium fittings, close to Financial District."
    }
  ],
  "jubilee hills": [
    {
      id: "j1",
      title: "Luxury Villa in Jubilee Hills",
      location: "Jubilee Hills, Hyderabad",
      price: "₹4.85 Cr",
      description: "Magnificent 4-bedroom villa with private garden, swimming pool, and smart home features."
    }
  ]
};

// User conversation history with improved tracking
let conversationContext: string[] = [];
let previousResponseTopic: string = '';
let userProfileInfo: Record<string, any> = {};
let activeConversationTopics: string[] = [];
let userIntent: string = '';
let userMentionedBudget: string | null = null;
let userMentionedTimeline: string | null = null;
let userMentionedRole: 'buyer' | 'seller' | 'investor' | null = null;

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
 * Improved intent matching with fuzzy search and semantic similarity
 */
function findIntent(message: string): { intent: string, response: string } | null {
  if (!message || message.trim() === '') return null;
  
  // Convert message to lowercase for case-insensitive matching
  const normalizedMessage = message.toLowerCase();
  
  // Track best match
  let bestMatchScore = 0;
  let bestMatchIntent = null;
  
  // Check each intent in the training data
  for (const intentData of trainingData) {
    for (const example of intentData.examples) {
      // Calculate a similarity score
      const exampleWords = example.toLowerCase().split(/\s+/).filter(word => word.length > 2);
      const messageWords = normalizedMessage.split(/\s+/).filter(word => word.length > 2);
      
      // Get matching words
      const matchingWords = exampleWords.filter(word => messageWords.includes(word));
      
      // Calculate score based on matching words and phrase length
      let score = 0;
      if (matchingWords.length > 0) {
        // Score is the ratio of matching words to total words in the example, weighted by how many words matched
        score = (matchingWords.length / exampleWords.length) * (matchingWords.length / messageWords.length) * matchingWords.length;
        
        // Boost score for exact phrase matches
        if (normalizedMessage.includes(example.toLowerCase())) {
          score *= 1.5;
        }
      }
      
      // Update best match if this score is higher
      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatchIntent = intentData;
      }
    }
  }
  
  // Return the best match if it's above a threshold
  if (bestMatchScore > 0.1 && bestMatchIntent) {
    // Get a random response for this intent
    const responseIndex = Math.floor(Math.random() * bestMatchIntent.responses.length);
    return { 
      intent: bestMatchIntent.intent, 
      response: bestMatchIntent.responses[responseIndex]
    };
  }
  
  return null;
}

/**
 * Extract location mentions from user message
 */
function extractLocations(message: string): string[] {
  const locations = [];
  const normalizedMessage = message.toLowerCase();
  
  // Check for location mentions
  for (const location in locationBasedProperties) {
    if (normalizedMessage.includes(location.toLowerCase())) {
      locations.push(location);
    }
  }
  
  // Check for common Hyderabad locations not in our database
  const commonLocations = [
    "pocharam", "gachibowli", "jubilee hills", "banjara hills", "hitech city", 
    "kondapur", "madhapur", "kukatpally", "miyapur", "manikonda", "secunderabad",
    "financial district", "uppal", "nallagandla", "chandanagar"
  ];
  
  for (const location of commonLocations) {
    if (normalizedMessage.includes(location) && !locations.includes(location)) {
      locations.push(location);
    }
  }
  
  return locations;
}

/**
 * Extract property types from user message
 */
function extractPropertyTypes(message: string): string[] {
  const propertyTypes = [];
  const normalizedMessage = message.toLowerCase();
  
  const commonPropertyTypes = [
    "house", "apartment", "flat", "villa", "plot", "land", 
    "commercial", "shop", "office", "warehouse", "agricultural"
  ];
  
  for (const type of commonPropertyTypes) {
    if (normalizedMessage.includes(type)) {
      propertyTypes.push(type);
    }
  }
  
  return propertyTypes;
}

/**
 * Extract budget information from user message
 */
function extractBudget(message: string): string | null {
  const budgetRegex = /(\d+(\.\d+)?)\s*(lakhs|lakh|crores|crore|cr)/i;
  const match = message.match(budgetRegex);
  
  if (match) {
    return match[0];
  }
  
  return null;
}

/**
 * Extract timeline information from user message
 */
function extractTimeline(message: string): string | null {
  const timelineRegex = /(\d+)\s*(days|day|weeks|week|months|month|years|year)/i;
  const match = message.match(timelineRegex);
  
  if (match) {
    return match[0];
  }
  
  return null;
}

/**
 * Determine user role (buyer, seller, investor)
 */
function determineUserRole(message: string): 'buyer' | 'seller' | 'investor' | null {
  const normalizedMsg = message.toLowerCase();
  
  if (normalizedMsg.includes('buy') || normalizedMsg.includes('buying') || normalizedMsg.includes('purchase')) {
    return 'buyer';
  } else if (normalizedMsg.includes('sell') || normalizedMsg.includes('selling')) {
    return 'seller';
  } else if (normalizedMsg.includes('invest') || normalizedMsg.includes('roi') || normalizedMsg.includes('return')) {
    return 'investor';
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
 * Create a personalized response based on conversation context
 */
function createPersonalizedResponse(userMessage: string): string | null {
  // Extract key information
  const locations = extractLocations(userMessage);
  const propertyTypes = extractPropertyTypes(userMessage);
  const extractedBudget = extractBudget(userMessage);
  const extractedTimeline = extractTimeline(userMessage);
  const userRole = determineUserRole(userMessage);
  
  // Update tracking variables
  if (extractedBudget) {
    userMentionedBudget = extractedBudget;
  }
  
  if (extractedTimeline) {
    userMentionedTimeline = extractedTimeline;
  }
  
  if (userRole) {
    userMentionedRole = userRole;
  }
  
  // Update active conversation topics
  if (locations.length > 0) {
    activeConversationTopics = activeConversationTopics.filter(t => !t.startsWith('location:'));
    locations.forEach(loc => activeConversationTopics.push(`location:${loc}`));
  }
  
  if (propertyTypes.length > 0) {
    activeConversationTopics = activeConversationTopics.filter(t => !t.startsWith('type:'));
    propertyTypes.forEach(type => activeConversationTopics.push(`type:${type}`));
  }
  
  // Handle role-specific responses
  if (userRole === 'buyer' || userMessage.toLowerCase().includes('buy') || userMessage.toLowerCase().includes('buying')) {
    // If just "buying" without other context but we have previous context
    if (userMessage.toLowerCase() === 'buying' || userMessage.toLowerCase() === 'buy') {
      if (userMentionedBudget) {
        return `Great! I understand you're looking to buy a property with a budget of ${userMentionedBudget}${userMentionedTimeline ? ` within ${userMentionedTimeline}` : ''}. What type of property are you interested in? (Apartment, Villa, Plot, etc.)`;
      } else {
        return "I'd be happy to help you find a property to buy. Could you share your budget and what type of property you're looking for? (Apartment, Villa, Plot, etc.)";
      }
    }
    
    // If buyer mentioned budget and/or timeline in this message
    if (extractedBudget || extractedTimeline) {
      let response = `Thank you for sharing that information. `;
      
      if (locations.length > 0) {
        const location = locations[0];
        response += `Looking for properties in ${location} `;
      } else {
        response += `Looking for properties in Hyderabad `;
      }
      
      response += `with a budget of ${extractedBudget || userMentionedBudget || "your budget"}`;
      
      if (extractedTimeline || userMentionedTimeline) {
        response += ` within ${extractedTimeline || userMentionedTimeline}`;
      }
      
      response += `. What type of property are you interested in? (Apartment, Villa, Plot, etc.)`;
      return response;
    }
    
    // If the user has mentioned a specific location
    for (const location of locations) {
      const propertiesInLocation = locationBasedProperties[location];
      if (propertiesInLocation) {
        const property = propertiesInLocation[Math.floor(Math.random() * propertiesInLocation.length)];
        let response = `Great! I have several options in ${location.charAt(0).toUpperCase() + location.slice(1)}. `;
        
        if (propertyTypes.length > 0) {
          response += `For ${propertyTypes.join('/')} properties, `;
        }
        
        response += `one excellent choice is the "${property.title}" priced at ${property.price}. ${property.description}`;
        
        // Add budget context if available
        if (userMentionedBudget) {
          response += `\n\nIs this within your budget of ${userMentionedBudget}?`;
        } else {
          response += "\n\nWould you like to know more about this property or see other options in this area?";
        }
        return response;
      }
    }
  } else if (userRole === 'seller' || userMessage.toLowerCase().includes('sell') || userMessage.toLowerCase() === 'sellers') {
    return "As a seller, RC Bridge offers you premium listing services with zero brokerage. We connect you directly with serious buyers, handle viewings, and provide market valuation to ensure you get the best price. What kind of property are you looking to sell?";
  } else if (userRole === 'investor') {
    return "For investors, RC Bridge offers high-ROI properties with typical returns of 12%+ annually through a combination of rental income and appreciation. Would you like me to explain our investment opportunities in specific areas of Hyderabad?";
  }
  
  // If we're talking about market trends
  if (userMessage.toLowerCase().includes('market') || userMessage.toLowerCase().includes('trend')) {
    return "Hyderabad's real estate market has shown robust growth with 15-20% annual appreciation in premium areas. The IT corridor (HITEC City, Financial District) continues to drive demand, while areas like Kokapet and Tellapur are emerging as high-potential zones. Would you like to know about specific area trends?";
  }
  
  // Check if we have an active location from previous messages
  const activeLocationTopic = activeConversationTopics.find(t => t.startsWith('location:'));
  if (activeLocationTopic) {
    const location = activeLocationTopic.split(':')[1];
    const propertiesInLocation = locationBasedProperties[location];
    
    if (propertiesInLocation && propertyTypes.length > 0) {
      // User previously mentioned a location and now mentions a property type
      const property = propertiesInLocation[Math.floor(Math.random() * propertiesInLocation.length)];
      return `For ${propertyTypes.join('/')} properties in ${location}, I recommend checking out "${property.title}" priced at ${property.price}. ${property.description}\n\nDoes this match what you're looking for?`;
    }
  }
  
  return null;
}

/**
 * Helper to add conversational markers to responses
 */
function addConversationalElements(response: string, userMessage: string): string {
  // Don't modify response if it already has conversational elements
  if (response.includes('!') || response.includes('?') || response.includes('...')) {
    return response;
  }
  
  const conversationalIntros = [
    "Absolutely! ",
    "Great question. ",
    "I'd be happy to help with that. ",
    "Thanks for asking. ",
    "I'm glad you're interested in that. "
  ];
  
  const conversationalFollowUps = [
    " Is there anything specific you'd like to know about this?",
    " Would you like more details?",
    " Does that help with what you're looking for?",
    " Is there something else you'd like to explore?",
    " How does that sound to you?"
  ];
  
  // Get user's name if available in profile
  let personalization = "";
  if (userProfileInfo.name) {
    personalization = ` ${userProfileInfo.name}`;
  }
  
  // Add intro based on message length and type
  let enhancedResponse = response;
  const isQuestion = userMessage.includes('?');
  
  if (Math.random() > 0.5 || isQuestion) {
    const intro = conversationalIntros[Math.floor(Math.random() * conversationalIntros.length)];
    enhancedResponse = intro + enhancedResponse;
  }
  
  // Add personalization and follow-up based on message context
  if (Math.random() > 0.6 && !enhancedResponse.includes("?")) {
    const followUp = conversationalFollowUps[Math.floor(Math.random() * conversationalFollowUps.length)];
    enhancedResponse = enhancedResponse + followUp;
  }
  
  return enhancedResponse;
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
    
    // Check for short messages that need context
    if (message.length < 10) {
      // Handle very short messages by checking previous context
      if (message.toLowerCase() === 'buying' || message.toLowerCase() === 'buy') {
        userMentionedRole = 'buyer';
        return "Great! I'd be happy to help you find a property to buy. Could you tell me your budget range and what areas of Hyderabad you're interested in?";
      } else if (message.toLowerCase() === 'selling' || message.toLowerCase() === 'sell' || message.toLowerCase() === 'sellers') {
        userMentionedRole = 'seller';
        return "As a seller, RC Bridge offers you premium listing services with zero brokerage. We connect you directly with serious buyers, handle viewings, and provide market valuation. What kind of property are you looking to sell?";
      } else if (message.toLowerCase() === 'investing' || message.toLowerCase() === 'invest' || message.toLowerCase() === 'investment') {
        userMentionedRole = 'investor';
        return "For investors, RC Bridge offers high-ROI properties with typical returns of 12%+ annually through a combination of rental income and appreciation. Would you like me to explore investment opportunities based on your capital range?";
      }
    }
    
    // Budget + Timeline detection for better personalization
    const extractedBudget = extractBudget(message);
    const extractedTimeline = extractTimeline(message);
    
    if (extractedBudget && extractedTimeline) {
      userMentionedBudget = extractedBudget;
      userMentionedTimeline = extractedTimeline;
      
      return `Thank you for sharing your budget of ${extractedBudget} and timeline of ${extractedTimeline}. This helps me find the right properties for you. Are you looking for residential or commercial properties?`;
    } else if (extractedBudget) {
      userMentionedBudget = extractedBudget;
      
      return `I've noted your budget of ${extractedBudget}. What type of property are you looking for and in which area of Hyderabad are you interested?`;
    } else if (extractedTimeline) {
      userMentionedTimeline = extractedTimeline;
      
      return `I understand you're looking to move forward within ${extractedTimeline}. What's your budget range and property type preference?`;
    }
    
    // Check for personalized response based on location/property type
    const personalizedResponse = createPersonalizedResponse(message);
    if (personalizedResponse) {
      previousResponseTopic = 'personalized';
      return personalizedResponse;
    }
    
    // First try to match from the training data
    const intentMatch = findIntent(message);
    
    if (intentMatch) {
      console.log(`Found intent match: ${intentMatch.intent}`);
      userIntent = intentMatch.intent;
      previousResponseTopic = intentMatch.intent;
      return addConversationalElements(intentMatch.response, message);
    }
    
    // If no match, fall back to the legacy intent analysis
    console.log('No exact intent match found, using contextual analysis');
    const intent = analyzeIntent(message);
    let response = '';
    
    // Generate contextual responses based on intent
    switch (intent) {
      case 'greeting':
        previousResponseTopic = 'greeting';
        response = knowledgeBase.greetings[Math.floor(Math.random() * knowledgeBase.greetings.length)];
        response += "\n\nAre you looking to buy, sell, or invest in properties? I can provide information about available properties, market trends, and connect you with the right opportunities.";
        break;
      case 'property':
        previousResponseTopic = 'property';
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
        previousResponseTopic = 'agricultural';
        const agriProperty = sampleProperties[3]; // Agricultural property
        response = `We have several agricultural property options available. For example, we have "${agriProperty.title}" in ${agriProperty.location} priced at ${agriProperty.price}. ${agriProperty.description}\n\nAre you looking for any specific features in agricultural land?`;
        break;
      case 'investment':
        previousResponseTopic = 'investment';
        response = knowledgeBase.investment[Math.floor(Math.random() * knowledgeBase.investment.length)];
        response += "\n\nWould you like to learn more about specific investment opportunities or ROI calculations?";
        break;
      case 'financing':
        previousResponseTopic = 'financing';
        response = knowledgeBase.financing[Math.floor(Math.random() * knowledgeBase.financing.length)];
        response += "\n\nI can connect you with our finance experts for personalized advice if you're interested.";
        break;
      case 'location':
        previousResponseTopic = 'location';
        response = knowledgeBase.locations[Math.floor(Math.random() * knowledgeBase.locations.length)];
        response += "\n\nDo you have a specific area of Hyderabad in mind for your property search?";
        break;
      case 'process':
        previousResponseTopic = 'process';
        response = knowledgeBase.process[Math.floor(Math.random() * knowledgeBase.process.length)];
        response += "\n\nWould you like to tell me more about what you're looking for so I can help you get started?";
        break;
      default:
        // Check for questions about price ranges
        if (message.includes('price') || message.includes('cost') || message.includes('budget') || message.includes('afford')) {
          previousResponseTopic = 'pricing';
          response = "Our properties range from ₹80 lakhs for apartments in developing areas to ₹20+ crores for luxury villas in premium localities. Commercial properties start at ₹2 crores. What budget range are you considering?";
        } 
        // Check for timing-related questions
        else if (message.includes('when') || message.includes('how long') || message.includes('time') || message.includes('duration')) {
          previousResponseTopic = 'timing';
          response = "The typical property transaction through RC Bridge takes about 30-45 days from selection to possession. Premium properties might involve customized timelines based on your requirements. How soon are you looking to move forward?";
        }
        // Short, simple user responses (like "yes", "no", "ok")
        else if (message.length < 5) {
          // Check last bot message for context
          const lastUserMessage = conversationContext[conversationContext.length - 2] || "";
          
          if (message.toLowerCase() === "yes" || message.toLowerCase() === "yeah") {
            if (previousResponseTopic === 'personalized' || previousResponseTopic === 'property') {
              response = "Great! To proceed further, I'd need a bit more information. Could you share your contact details so our team can get in touch with you about these properties? Or would you like to explore more options first?";
            } else {
              response = "Excellent! To better assist you, could you tell me more about your preferences? Are you looking for a specific type of property or location in Hyderabad?";
            }
          } else if (message.toLowerCase() === "no" || message.toLowerCase() === "nope") {
            response = "I understand. Let me know what you're interested in, and I'll be happy to help you explore other options that better match your requirements.";
          } else if (message.toLowerCase() === "ok" || message.toLowerCase() === "sure") {
            response = "Wonderful! Please let me know what specific information you're looking for, and I'll provide relevant details about properties in Hyderabad.";
          } else {
            // Check if we have role context to provide a relevant response
            if (userMentionedRole === 'buyer') {
              response = "I'd love to help you find the perfect property to buy. Could you share more details about your preferred location in Hyderabad, budget, and property type?";
            } else if (userMentionedRole === 'seller') {
              response = "I'd be happy to help you sell your property. Could you share more details about the type of property, location, and your expected price?";
            } else if (userMentionedRole === 'investor') {
              response = "For investment opportunities, I'd need to know your capital range and investment timeline. Would you prefer residential or commercial properties for investment?";
            } else {
              response = "I'd be happy to help you with your real estate needs. Are you looking to buy, sell, or invest in properties in Hyderabad?";
            }
          }
        }
        // General fallback response
        else {
          response = "I'd be happy to help you with information about properties in Hyderabad, investment opportunities, financing options, or the buying/selling process. Could you please tell me more about what you're looking for?";
        }
    }
    
    return addConversationalElements(response, message);
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
 * Store user profile information for personalization
 */
export function updateUserProfile(profileData: Record<string, any>): void {
  userProfileInfo = { ...userProfileInfo, ...profileData };
  console.log('Updated user profile:', userProfileInfo);
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
  userProfileInfo = {};
  userIntent = '';
  previousResponseTopic = '';
  activeConversationTopics = [];
  userMentionedBudget = null;
  userMentionedTimeline = null;
  userMentionedRole = null;
}
