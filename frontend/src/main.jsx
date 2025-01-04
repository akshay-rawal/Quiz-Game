import { createRoot } from 'react-dom/client';
import './index.css';
import React from 'react';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'; 
import store from './store/store.js';
import SessionManager from './utills/sessionInitializer.jsx'; // Ensure this path is correct
import ThemeProvider from './components/ThemeContext.jsx';
import { GuestUserProvider } from "../src/guestuser/GuestuserContext.jsx"


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <SessionManager>
        <ThemeProvider>
          <GuestUserProvider>
          <App />
          </GuestUserProvider>
        </ThemeProvider>
      </SessionManager>
    </Router>
  </Provider>
);
