import express from 'express';
import Question from '../../models/questionSchema.js'; // Assuming the Question model is here
import authenticate from '../../middleware/authenticate.js';

const router = express.Router();
router.delete('/delete-duplicates', async (req, res) => {
  try {
    const duplicates = await Question.aggregate([
      {
        $group: {
          _id: "$questionText", 
          count: { $sum: 1 },   
          ids: { $push: "$_id" }
        }
      },
      {
        $match: { count: { $gt: 1 } } 
      }
    ]);
    for (const duplicate of duplicates) {
      const idsToDelete = duplicate.ids.slice(1); 
      await Question.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(200).json({ message: "Duplicate questions removed successfully!" });
  } catch (error) {
    console.error("Error deleting duplicates:", error);
    res.status(500).json({ message: "Error deleting duplicate questions." });
  }
});

router.delete('/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Find and delete the question
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(200).json({ message: "Question deleted successfully!", question: deletedQuestion });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Error deleting question." });
  }
});

export default router;
