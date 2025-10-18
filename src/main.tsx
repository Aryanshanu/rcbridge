import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root element with responsive meta tag
document.head.innerHTML += `
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
`;

// Add global styles
const style = document.createElement('style');
style.innerHTML = `
  #root {
    width: 100%;
    max-width: 100vw;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
  
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    width: 100vw;
    max-width: 100vw;
  }
  
  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
    width: 100vw;
    max-width: 100vw;
  }
  
  /* Prevent FOUC (Flash Of Unstyled Content) */
  .no-fouc {
    visibility: hidden;
  }
  
  /* Add global loading indicator */
  .page-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    z-index: 9999;
    transition: opacity 0.3s ease-out;
  }

  /* Add loading animation */
  .loading-spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 4px solid rgba(30, 58, 138, 0.1);
    border-top-color: #1E3A8A;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Error state */
  .error-page {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }
`;
document.head.appendChild(style);

// Add loading indicator with branded elements
const loadingElement = document.createElement('div');
loadingElement.className = 'page-loading';
loadingElement.innerHTML = `
  <div class="flex flex-col items-center">
    <img src="/lovable-uploads/5fd561ff-5bbd-449c-94a3-d39d0a8b4f03.png" alt="RC Bridge Logo" class="w-16 h-16 mb-4" />
    <div class="loading-spinner"></div>
    <p class="mt-4 text-primary font-medium">Loading RC Bridge...</p>
  </div>
`;
document.body.appendChild(loadingElement);

// Create root with error handling
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.classList.add('no-fouc');
  console.log('Root element found');
} else {
  console.error('Root element not found! Creating a new one.');
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
}

// Get the root element again in case we had to create it
const finalRootElement = document.getElementById('root');

// Initialize app with error handling
const root = createRoot(finalRootElement!);

// Log the current URL for debugging
console.log('Current URL at load time:', window.location.pathname + window.location.search);
console.log('Checking for redirectPath in sessionStorage');
const redirectPath = sessionStorage.getItem('redirectPath');
if (redirectPath) {
  console.log('Found redirectPath:', redirectPath);
  // Clear it to prevent redirection loops
  sessionStorage.removeItem('redirectPath');
} else {
  console.log('No redirectPath found in sessionStorage');
}

try {
  console.log('Attempting to render App component...');
  root.render(<App />);
  console.log('App component rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
  if (finalRootElement) {
    finalRootElement.innerHTML = `
      <div class="error-page">
        <img src="/lovable-uploads/5fd561ff-5bbd-449c-94a3-d39d0a8b4f03.png" alt="RC Bridge Logo" class="w-16 h-16 mb-4 mx-auto" />
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p class="mb-4 text-gray-600">We're sorry, but there was an error loading the application. Please try refreshing the page.</p>
        <p class="mb-6 p-3 bg-red-50 text-red-600 rounded border border-red-200 text-sm font-mono">${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="window.location.reload()" class="bg-primary text-white px-6 py-2 rounded-full shadow-md hover:bg-primary/90 transition-colors">
          Refresh Page
        </button>
      </div>
    `;
    finalRootElement.classList.remove('no-fouc');
  }
}

// Remove loading indicator and show content when app is ready
window.addEventListener('load', () => {
  console.log('Window load event triggered');
  setTimeout(() => {
    loadingElement.style.opacity = '0';
    if (finalRootElement) {
      console.log('Removing no-fouc class from root element');
      finalRootElement.classList.remove('no-fouc');
    }
    setTimeout(() => {
      loadingElement.remove();
      console.log('Loading element removed');
    }, 300);
  }, 500); // Increased delay for smoother transition
});

// Add global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error || event.message);
  
  // Display a toast notification for the error
  const createErrorToast = (message: string) => {
    const toastElement = document.createElement('div');
    toastElement.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded shadow-lg z-50 flex items-center';
    toastElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      ${message}
      <button class="ml-3 text-white" onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(toastElement);
    setTimeout(() => {
      toastElement.style.opacity = '0';
      setTimeout(() => toastElement.remove(), 300);
    }, 5000);
  };
  
  // Attempt to recover from fatal errors
  if (event.message && event.message.includes('ChunkLoadError')) {
    console.log('Detected chunk load error, attempting to recover by reloading the page');
    createErrorToast('Network error detected. Reloading page...');
    setTimeout(() => window.location.reload(), 2000);
  } else {
    createErrorToast('An error occurred. Some features might not work properly.');
  }
});

// Define toast for error handling
const toast = {
  error: (message: string) => {
    const toastElement = document.createElement('div');
    toastElement.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
    toastElement.textContent = message;
    document.body.appendChild(toastElement);
    setTimeout(() => {
      toastElement.style.opacity = '0';
      setTimeout(() => toastElement.remove(), 300);
    }, 5000);
  }
};
