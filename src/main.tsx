import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import "./i18n"; // 👈 import i18n vào đây
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
)
