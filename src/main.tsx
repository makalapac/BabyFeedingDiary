import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = import.meta.env.MODE === 'production' 
      ? '/BabyFeedingDiary/service-worker.js'
      : '/service-worker.js';

    navigator.serviceWorker.register(swUrl).then(
      (registration) => {
        console.log('ServiceWorker registration successful:', registration.scope);
      },
      (err) => {
        console.error('ServiceWorker registration failed:', err);
      }
    );
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 