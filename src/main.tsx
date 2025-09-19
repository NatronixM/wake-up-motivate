import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Disable/cleanup service worker in preview/dev to prevent caching white screens
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => reg.unregister().catch(() => {}));
  });
  // Intentionally not registering a new service worker in this environment
}

console.log('Main.tsx starting to render app');
createRoot(document.getElementById("root")!).render(<App />);
