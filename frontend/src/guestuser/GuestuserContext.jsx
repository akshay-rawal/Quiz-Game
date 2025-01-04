// GuestUserContext.js
import React, { createContext, useState, useContext } from 'react';

const GuestUserContext = createContext();

export const useGuestUser = () => useContext(GuestUserContext);

export const GuestUserProvider = ({ children }) => {
  const [guestUser, setGuestUser] = useState(null);

  const loginAsGuest = async () => {
    try {
      // Correct fetch URL using the environment variable
      const response = await fetch(`${import.meta.env.VITE_API_URL}/guest`);

      if (!response.ok) {
        throw new Error('Failed to fetch guest user');
      }

      // Parse response as JSON
      const data = await response.json();
      setGuestUser(data);
    } catch (error) {
      console.error('Error logging in as guest:', error);
    }
  };

  return (
    <GuestUserContext.Provider value={{ guestUser, loginAsGuest }}>
      {children}
    </GuestUserContext.Provider>
  );
};
