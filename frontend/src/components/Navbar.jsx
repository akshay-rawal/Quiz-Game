import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/store.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext.jsx";

function Navbar() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme,resetTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    resetTheme();
    navigate("/");
  };

  return (
    <nav
      className={`p-4 flex justify-between items-center ${
        isDark ? "bg-gray-700 text-white" : "bg-blue-500 text-black"
      }`}
    >
      <div className="flex items-center space-x-6">
        <Link
          to="/leaderboard"
          className="mr-4 hover:underline flex flex-col items-center"
        >
          <img
            src="leaderboard.png"
            alt="Leaderboard"
            className={`w-5 h-5 mb-1 ${
              isDark ? "bg-gray-700 text-white" : "bg-blue-500 text-black"
            }`}
          />
          <span
            className={`text-sm font-semibold text-center ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Leaderboard
          </span>
        </Link>

        {user && (
          <button
            onClick={handleLogout}
            className="hover:underline flex flex-col items-center"
          >
            <img
              src="logout-svgrepo-com.svg"
              alt="Logout"
              className={`w-5 h-5 mr-2 inline-block ${isDark ? "fill-white" : "fill-black"}`}

            />
            <span
              className={`text-sm font-semibold text-center ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Logout
            </span>
          </button>
        )}
      </div>

      <div className="flex items-center">
        <span className="mr-4">{user?.username}</span>
        <button
          onClick={toggleTheme}
          className="py-2 px-4 rounded-md focus:outline-none text-black  dark:text-white"
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1.5M6.343 6.343l-1.061 1.061M3 12H1.5M6.343 17.657l-1.061-1.061M12 21v1.5M17.657 17.657l1.061-1.061M21 12h1.5M17.657 6.343l1.061 1.061M12 7.5A4.5 4.5 0 1112 16.5 4.5 4.5 0 0112 7.5z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-5 h-5 text-black"
            >
              <path
                d="M21 12.75A9.75 9.75 0 1111.25 3 7.5 7.5 0 1021 12.75z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
