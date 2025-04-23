import React, { createContext, useState, useEffect } from "react";

// 1. Named export only (no default export)
export const GuestUserContext = createContext();

export const GuestUserProvider = ({ children }) => {
  const loadGuestUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return { isGuest: false, scores: {} };
    }

    const savedGuestUser = localStorage.getItem("guestUser");
    return savedGuestUser
      ? JSON.parse(savedGuestUser)
      : { isGuest: true, scores: {} };
  };

  const [guestUser, setGuestUser] = useState(loadGuestUser);

  // 2. Auto-clear guest data if user logs in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && guestUser.isGuest) {
      setGuestUser({ isGuest: false, scores: {} });
      localStorage.removeItem("guestUser");
    }
  }, [guestUser]);

  // 3. Save guest data in localStorage
  useEffect(() => {
    if (guestUser.isGuest) {
      localStorage.setItem("guestUser", JSON.stringify(guestUser));
    }
  }, [guestUser]);

  const updateGuestUserScore = (category, newScore) => {
    setGuestUser((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [category]: newScore,
      },
    }));
  };

  return (
    <GuestUserContext.Provider value={{ guestUser, updateGuestUserScore }}>
      {children}
    </GuestUserContext.Provider>
  );
};
