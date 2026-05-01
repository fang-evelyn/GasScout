import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css'; // Make sure this file exists for your Tailwind styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);