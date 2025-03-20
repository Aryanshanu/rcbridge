
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root element with responsive meta tag
document.head.innerHTML += `
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
`;

// Add a custom style to make sure the root div takes full width
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
  
  /* Improve image rendering */
  img {
    image-rendering: auto;
  }
  
  /* Add smooth transitions */
  * {
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-duration: 300ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Fix for mobile viewport issues */
  @media screen and (max-width: 768px) {
    body, html, #root {
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
    }
  }
  
  /* Error page styling */
  .error-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 1rem;
    text-align: center;
  }
  
  /* Critical CSS for initial render */
  .bg-primary {
    background-color: #4f46e5;
  }
  
  .text-white {
    color: white;
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Offline fallback */
  .offline-alert {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    padding: 1rem;
    background-color: #f59e0b;
    color: white;
    border-radius: 0.5rem;
    z-index: 9999;
    display: none;
  }
  
  html.offline .offline-alert {
    display: block;
  }
`;
document.head.appendChild(style);

// Add loading indicator that will be removed when app is ready
const loadingElement = document.createElement('div');
loadingElement.className = 'page-loading';
loadingElement.innerHTML = '<div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>';
document.body.appendChild(loadingElement);

// Add offline indicator
const offlineElement = document.createElement('div');
offlineElement.className = 'offline-alert';
offlineElement.innerHTML = 'You are currently offline. Some features may not work properly.';
document.body.appendChild(offlineElement);

// Create root and add no-fouc class
const rootElement = document.getElementById('root');
if (rootElement) rootElement.classList.add('no-fouc');

// Handle network status
window.addEventListener('online', () => {
  document.documentElement.classList.remove('offline');
});

window.addEventListener('offline', () => {
  document.documentElement.classList.add('offline');
});

// Initialize app with error handling
const root = createRoot(rootElement!);
try {
  root.render(<App />);
} catch (error) {
  console.error('Error rendering app:', error);
  if (rootElement) {
    rootElement.innerHTML = `
      <div class="error-page">
        <h1>Something went wrong</h1>
        <p>We're sorry, but there was an error loading the application. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" class="bg-primary text-white px-4 py-2 rounded mt-4">
          Refresh Page
        </button>
      </div>
    `;
    rootElement.classList.remove('no-fouc');
  }
  // Remove loading indicator
  loadingElement.style.opacity = '0';
  setTimeout(() => {
    loadingElement.remove();
  }, 300);
}

// Remove loading indicator and show content when app is ready
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingElement.style.opacity = '0';
    if (rootElement) rootElement.classList.remove('no-fouc');
    setTimeout(() => {
      loadingElement.remove();
    }, 300);
  }, 300);
});

// Add global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error || event.message);
  // Don't show error UI for non-critical errors (like script loading, image loading)
  if (event.error && event.error.message && !event.filename?.includes('extension')) {
    const isAssetError = event.filename?.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js)$/i);
    if (!isAssetError) {
      toast.error('An error occurred. Please try refreshing the page.');
    }
  }
});

// Define toast for the error handler above
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
