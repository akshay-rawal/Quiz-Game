import { useEffect, useState } from "react";
import axiosInstance from "../utills/axios";
import { useTheme } from "./ThemeContext";
import ProtectedRoute from '../guestuser/ProtectedRoute.jsx'

const Leaderboard = () => {
 
    const {isDark} = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);

  // Function to fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const response = await axiosInstance.get("/leaderboard",
       );
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <ProtectedRoute>
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
    <h2 className={`text-2xl font-bold mb-6 text-center ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      Leaderboard
    </h2>
    <table className={`min-w-full table-auto shadow-md rounded-lg  max-w-full overflow-x-auto ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <thead>
        <tr className={`bg-gray-200 text-left ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'} `}>
          <th className="px-4 py-2  text-sm sm:text-base">Category</th>
          <th className="px-4 py-2  text-sm sm:text-base">Total Score</th>
          <th className="px-4 py-2  text-sm sm:text-base">Correct Answers</th>
          <th className="px-4 py-2  text-sm sm:text-base">Incorrect Answers</th>
          <th className="px-4 py-2  text-sm sm:text-base">Pending Questions</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.length > 0 ? (
          leaderboard.map((category) => (
            <tr key={category._id} className={`${
              isDark ? "bg-gray-300 text-black" : "bg-gray-200 text-black"
            }`}>
              <td className="px-4 py-2 ">{category._id}</td>
              <td className="px-4 py-2">{category.totalScore}</td>
              <td className="px-4 py-2">{category.correctAnswers}</td>
              <td className="px-4 py-2">{category.incorrectAnswers}</td>
              <td className="px-4 py-2">{category.pendingAnswers}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
              No leaderboard data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  </ProtectedRoute>
  );
};

export default Leaderboard;
