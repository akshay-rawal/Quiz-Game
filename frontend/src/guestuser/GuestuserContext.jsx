import React, { createContext, useState, useEffect } from "react";

// Creating the context
export const GuestUserContext = createContext();

export const GuestUserProvider = ({ children }) => {
  // Load the guest user data from localStorage if available
  const loadGuestUser = () => {
    const savedGuestUser = localStorage.getItem("guestUser");
    if (savedGuestUser) {
      return JSON.parse(savedGuestUser);
    }
    return {
      isGuest: true,
      scores: {},
    };
  };

  const [guestUser, setGuestUser] = useState(loadGuestUser);

  // Save guest user data to localStorage whenever it changes
  useEffect(() => {
    if (guestUser.isGuest) {
      localStorage.setItem("guestUser", JSON.stringify(guestUser));
    }
  }, [guestUser]);

  // Function to update guest user's score for a particular category
  const updateGuestUserScore = (category, newScore) => {
    setGuestUser((prev) => {
      const updatedScores = {
        ...prev.scores,
        [category]: newScore,
      };

      return {
        ...prev,
        scores: updatedScores,
      };
    });
  };

  return (
    <GuestUserContext.Provider value={{ guestUser, updateGuestUserScore }}>
      {children}
    </GuestUserContext.Provider>
  );
};
