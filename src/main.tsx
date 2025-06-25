import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import "./i18n"; // 👈 import i18n vào đây
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
)
