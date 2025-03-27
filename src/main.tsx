
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
`;
document.head.appendChild(style);

// Add loading indicator that will be removed when app is ready
const loadingElement = document.createElement('div');
loadingElement.className = 'page-loading';
loadingElement.innerHTML = '<div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>';
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
        <h1>Something went wrong</h1>
        <p>We're sorry, but there was an error loading the application. Please try refreshing the page.</p>
        <p style="color: red;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="window.location.reload()" class="bg-primary text-white px-4 py-2 rounded mt-4">
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
  }, 300);
});

// Add global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error || event.message);
  
  // Attempt to recover from fatal errors
  if (event.message && event.message.includes('ChunkLoadError')) {
    console.log('Detected chunk load error, attempting to recover by reloading the page');
    window.location.reload();
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
