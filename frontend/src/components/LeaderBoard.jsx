import { useContext, useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import { GuestUserContext } from "../guestuser/GuestuserContext";
import axiosInstance from "../utills/axios";

const Leaderboard = () => {
  const { isDark } = useTheme();
  const { guestUser, scores } = useContext(GuestUserContext); // Get guest user scores
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  const fetchLeaderboard = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error

    if (guestUser) {
    
      // Ensure scores is a valid object before using Object.entries
      const safeScores = scores || {};
      const guestLeaderboard = Object.entries(safeScores).map(([category, totalScore]) => ({
        _id: category,
        totalScore: totalScore?.totalScore || 0,
        correctAnswers: totalScore?.correctAnswers || 0,
        incorrectAnswers: totalScore?.incorrectAnswers || 0,
        pendingQuestions: totalScore?.pendingQuestions || 0,
      }));
    
      setLeaderboard(guestLeaderboard);
      setLoading(false); // End loading
    }
     else {
      try {
        const response = await axiosInstance.post("/leaderboard");
        setLeaderboard(response.data.leaderboard);
      } catch (error) {
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [guestUser]);

  return (
    <div className={`p-6 min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <h2 className={`text-2xl font-bold mb-6 text-center ${isDark ? "text-white" : "text-black"}`}>
        Leaderboard
      </h2>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="loader">Loading...</div>
        </div>
      )}

      {error && <div className="text-red-500 text-center">{error}</div>}

      {!loading && !error && (
        <table className={`min-w-full table-auto shadow-md rounded-lg max-w-full overflow-x-auto ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
          <thead>
            <tr className={`bg-gray-200 text-left ${isDark ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Total Score</th>
              <th className="px-4 py-2">Correct Answers</th>
              <th className="px-4 py-2">Incorrect Answers</th>
              <th className="px-4 py-2">Pending Questions</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((category) => (
                <tr key={category._id} className={`${isDark ? "bg-gray-300 text-black" : "bg-gray-200 text-black"}`}>
                  <td className="px-4 py-2">{category._id}</td>
                  <td className="px-4 py-2">{category.totalScore}</td>
                  <td className="px-4 py-2">{category.correctAnswers}</td>
                  <td className="px-4 py-2">{category.incorrectAnswers}</td>
                  <td className="px-4 py-2">{category.pendingQuestions}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
