import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useState } from 'react';
// This component wraps any protected route and checks if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const { token,role} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  React.useEffect(() => {
    if (!token || role === 'guest') {
      // If the user is not authenticated, redirect them to the login page
      navigate('/');
    }else {
      setIsLoading(false); // If authenticated, stop loading
    }
  }, [token, navigate]);

  if (isLoading) {
    return null;
  }

  if (!token) {
    // If no token, prevent rendering the children (protected component)
    return null;
  }

  return children;
};

export default ProtectedRoute;
