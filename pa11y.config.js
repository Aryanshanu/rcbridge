module.exports = {
  // Standard configuration for Pa11y accessibility testing
  standard: 'WCAG2AA',
  
  // Runner (axe-core is more comprehensive than htmlcs)
  runner: 'axe',
  
  // Ignore certain issues if needed (be very careful with this)
  ignore: [
    // Example: 'color-contrast' - only ignore if you have a good reason
  ],
  
  // Viewport size
  viewport: {
    width: 1280,
    height: 1024
  },
  
  // Timeout for page load
  timeout: 30000,
  
  // Wait time after page load
  wait: 1000,
  
  // Browser configuration
  chromeLaunchConfig: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  
  // Actions to perform before testing (e.g., clicking buttons, filling forms)
  actions: [
    // Example: 'click element .cookie-accept',
    // Example: 'wait for element .main-content to be visible'
  ],
  
  // Headers to send with requests
  headers: {
    'User-Agent': 'Pa11y-CI'
  },
  
  // Hide elements from testing
  hideElements: [
    // Example: '.advertisement'
  ],
  
  // Levels to report (error, warning, notice)
  level: 'error',
  
  // Include warnings in results
  includeWarnings: false,
  
  // Include notices in results  
  includeNotices: false,
  
  // Reporter
  reporter: 'cli',
  
  // Log level (none, error, warn, info, debug)
  log: {
    debug: console.log,
    error: console.error,
    info: console.info
  }
};
