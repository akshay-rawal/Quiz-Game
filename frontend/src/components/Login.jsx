import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from '../store/store.js';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utills/axios.js";

import {useGuestUser} from "../guestuser/GuestuserContext.jsx"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // Loading state to show user feedback
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {loginAsGuest} = useGuestUser();

  
  const handleLogin = async (e) => {
    
    e.preventDefault();
    setLoading(true);  // Set loading state to true when login starts

    try {
      const response = await axiosInstance.post("auth/login", {
        email,
        password,
      });

      const { user, accessToken } = response.data;
      if (user && accessToken) {
        dispatch(login({ user, token: accessToken, userId: user.userId }));
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        navigate("/home");
      } else {
        alert("Login failed: Missing user or token in response");
      }
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = error.response?.data?.message || "An error occurred during login.";
      alert(errorMessage);
    } finally {
      setLoading(false);  // Set loading state to false after the request is finished
    }
  };
  const handleGuestLogin = async () => {
    await loginAsGuest(); // Trigger the guest login function
    navigate("/home"); // Optionally, navigate to home after guest login
  };

  return (
    <div
  className="flex items-center justify-center min-h-screen"
  
  >
    <div className="bg-white p-6 rounded shadow-md w-96 max-w-full">
      <h2 className="text-2xl font-bold mb-4 text-center uppercase bg-gray-700 text-white py-2 px-4 rounded-t">
        Login to your account
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Username Input */}
        <input
          type="text"
          id="email"
          name="email"
          placeholder="email"
          autoComplete="email"
          className="w-full p-3 border-b border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 placeholder-gray-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Password Input */}
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          className="w-full p-3 border-b border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 placeholder-gray-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all focus:outline-none focus:ring focus:ring-blue-300"
        >
          Login
        </button>
        {/* Forgot Username Link */}
        <p className="mt-4 text-center text-gray-700">
 
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          Signup
        </a>

        </p>
        <p className="text-center text-gray-700">
        <a
              href="#"
              onClick={handleGuestLogin} // Use the guest login handler
              className="text-blue-500 hover:underline"
            >
              Guest User
            </a>
        
        </p>
      </form>
    </div>
  </div>
  
  );  
}

export default Login;
