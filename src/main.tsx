
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
`;
document.head.appendChild(style);

// Add loading indicator that will be removed when app is ready
const loadingElement = document.createElement('div');
loadingElement.className = 'page-loading';
loadingElement.innerHTML = '<div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>';
document.body.appendChild(loadingElement);

// Create root and add no-fouc class
const rootElement = document.getElementById('root');
if (rootElement) rootElement.classList.add('no-fouc');

// Initialize app
const root = createRoot(rootElement!);
root.render(<App />);

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
