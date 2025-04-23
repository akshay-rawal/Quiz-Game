import { useContext, useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import { GuestUserContext } from "../guestuser/GuestuserContext";
import axiosInstance from "../utills/axios";

const Leaderboard = () => {
  const { isDark } = useTheme();
  const { guestUser } = useContext(GuestUserContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    console.log("Fetching leaderboard...");
    setLoading(true);
    setError(null);

    if (guestUser?.isGuest === true) {
      console.log("Guest user detected");
      const scores = guestUser?.scores || {};
      console.log("Guest scores from context:", scores);

      const guestLeaderboard = Object.entries(scores).map(([category, totalScore]) => ({
        _id: category,
        category,
        totalScore: totalScore?.totalScore || 0,
        correctAnswers: totalScore?.correctAnswers || 0,
        incorrectAnswers: totalScore?.incorrectAnswers || 0,
        pendingQuestions: totalScore?.pendingQuestions ?? 0,
      }));

      console.log("Generated guest leaderboard:", guestLeaderboard);
      setLeaderboard(guestLeaderboard);
      setLoading(false);
    } else {
      try {
        console.log("Authenticated user - Fetching from backend");
        const response = await axiosInstance.get("/leaderboard");
        const mappedData = response.data.leaderboard.map(item => ({
          ...item,
          pendingQuestions: item.pendingAnswers ?? 0,
        }));
        console.log("Mapped leaderboard data:", mappedData);
        setLeaderboard(mappedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log("useEffect triggered – guestUser:", guestUser);
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
                <tr key={category._id || `${category.category}-${Math.random()}`} className={`${isDark ? "bg-gray-300 text-black" : "bg-gray-200 text-black"}`}>
                  <td className="px-4 py-2">{category.category}</td>
                  <td className="px-4 py-2">{category.totalScore}</td>
                  <td className="px-4 py-2">{category.correctAnswers}</td>
                  <td className="px-4 py-2">{category.incorrectAnswers}</td>
                  <td className="px-4 py-2">{category.pendingQuestions ?? 0}</td>
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
