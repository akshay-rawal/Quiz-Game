import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/store";
import axiosInstance from "../utills/axios";
import {useGuestUser} from "../guestuser/GuestuserContext.jsx"
function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loginAsGuest} = useGuestUser();


  const handleSignup = async () => {
    try {
      const response = await axiosInstance.post("/auth/signup", {
        username,
        email,
        password,
      });

      console.log("Signup successful:", response.data);

      const { accessToken, themePreference, user } = response.data;

      if (!accessToken) {
        throw new Error("Access token is missing in the signup response.");
      }

      // Save access token and user info to Redux and localStorage
      dispatch(login({ user, token: accessToken, userId: user.userId }));

      // Optionally handle theme preference
      const { isDark } = themePreference || {};
      localStorage.setItem("isDark", JSON.stringify(isDark));

      console.log("Theme preference saved:", isDark);

      // Redirect to home after successful signup
      navigate("/home");
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error.response?.data?.message || "An error occurred during signup."
      );
    }
  };
  const handleGuestLogin = async () => {
    await loginAsGuest(); // Trigger the guest login function
    navigate("/home"); // Optionally, navigate to home after guest login
  };
  return (
    <div
  className="flex items-center justify-center h-screen bg-cover bg-center bg-fixed">
  <div className="bg-white p-6 rounded shadow-md w-96 max-w-full">
    <h2 className="text-2xl font-bold mb-4 text-center uppercase bg-gray-700 text-white py-2 px-4 rounded-t">
      Signup
    </h2>
    <input
      type="text"
      placeholder="Username"
      className="w-full p-3 border-b border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 placeholder-gray-500"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <input
      type="email"
      placeholder="Email"
      className="w-full p-3 border-b border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 placeholder-gray-500"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      className="w-full p-3 border-b border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 placeholder-gray-500"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
    <button
      onClick={handleSignup}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all focus:outline-none focus:ring focus:ring-blue-300"
    >
      Signup
    </button>
    <p className="text-center text-gray-700 mt-4">
        <a
              href="#"
              onClick={handleGuestLogin} // Use the guest login handler
              className="text-blue-500 hover:underline"
            >
              Guest User
            </a>
        
        </p>
  </div>
</div>
  );
}

export default Signup;
