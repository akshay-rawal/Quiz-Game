import ThemePreference from '../models/themeSchema.js';
import authenticate from '../middleware/authenticate.js';
import express from 'express';

const router = express.Router();

/**
 * Save the user's theme preference.
 */
router.post("/theme",authenticate, async (req, res) => {
    const { userId, isDark } = req.body;

    if (!userId || typeof isDark !== "boolean") {
        return res.status(400).json({ message: "Invalid request data" });
    }

    try {
        const updatedPreference = await ThemePreference.findOneAndUpdate(
            { userId: req.body.userId },
            { isDark: req.body.isDark },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (!updatedPreference) {
            console.error("Failed to update theme preference:", { userId, isDark });
            return res.status(500).json({ message: "Failed to update theme preference" });
        }

        res.status(200).json({ message: "Theme preference saved successfully", updatedPreference });
    } catch (error) {
        console.error("Error saving theme preference:", error);
        res.status(500).json({ message: "Error saving theme preference" });
    }
});


/**
 * Retrieve the user's theme preference.
 */
router.get('/theme/:userId', authenticate,async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find the user's theme preference
        const preference = await ThemePreference.findOne({ userId });

        // If no preference is found, return default light mode
        if (!preference) {
            return res.status(404).json({ isDark: false, message: "No theme preference found. Defaulting to light mode." });
        }

        res.status(200).json({ isDark: preference.isDark });
    } catch (error) {
        console.error("Error retrieving theme preference:", error);
        res.status(500).json({ message: "Failed to retrieve theme preference" });
    }
});

export default router;
