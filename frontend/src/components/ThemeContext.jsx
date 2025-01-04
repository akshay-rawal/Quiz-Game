import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utills/axios";
import { useSelector } from "react-redux";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        // Load theme from localStorage or default to light
        const storedTheme = localStorage.getItem("isDark");
        return storedTheme !== null ? JSON.parse(storedTheme) : null;
    });
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);
    const { user, token } = useSelector((state) => state.user);

    // Fetch theme from backend after login/signup or user changes
    useEffect(() => {
        const fetchTheme = async () => {
            if (!token || !user?.userId) {
                setIsThemeLoaded(true); // No user, consider theme loaded
                return;
            }

            try {
                const response = await axiosInstance.get(`/theme/${user.userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const themePreference = response.data.isDark;
                setIsDark(themePreference); // Set theme from backend
                localStorage.setItem("isDark", JSON.stringify(themePreference)); // Sync with localStorage
            } catch (error) {
                console.error("Error fetching theme:", error);
            } finally {
                setIsThemeLoaded(true); // Mark theme as loaded
            }
        };

        fetchTheme();
    }, [user, token]);

    // Apply the theme to the DOM
    useEffect(() => {
        if (isDark === null) return; // Avoid applying theme before it is set

        const body = document.body;
        if (isDark) {
            body.classList.add("bg-gray-800", "text-white");
            body.classList.remove("bg-white", "text-black");
        } else {
            body.classList.add("bg-white", "text-black");
            body.classList.remove("bg-gray-800", "text-white");
        }
    }, [isDark]);

    // Toggle theme and update backend
    const toggleTheme = async () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem("isDark", JSON.stringify(newTheme)); // Save new theme to localStorage

        if (token && user?.userId) {
            try {
                await axiosInstance.post(
                    "/theme",
                    { userId: user.userId, isDark: newTheme },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("Theme preference saved.");
            } catch (error) {
                console.error("Error saving theme preference:", error);
            }
        }
    };
      // Reset theme on logout
      const resetTheme = () => {
        setIsDark(false); // Reset to light mode
        localStorage.removeItem("isDark");
    };

    if (!isThemeLoaded) {
        // Prevent rendering until the theme is resolved
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme ,resetTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export default ThemeProvider;
