
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root element with responsive meta tag
document.head.innerHTML += `
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
`;

// Add a custom style to make sure the root div takes full width
const style = document.createElement('style');
style.innerHTML = `
  #root {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
  
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
