import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utills/axios";
import { useSelector } from "react-redux";
import { useTheme } from "./ThemeContext";
import { GuestUserContext } from "../guestuser/GuestuserContext";

function CategoryPage() {
  const { guestUser, updateGuestUserScore } = useContext(GuestUserContext); // Correctly access guest user context
  const { token, user } = useSelector((state) => state.user);
  const { category } = useParams();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const { isDark } = useTheme();

  const fetchData = async () => {
    console.log("Fetching data for category:", category); // Log category being fetched
    try {
      setLoading(true);

      const userId = guestUser ? "guest" : user.userId;
      console.log("User ID being used for request:", userId); // Log userId (guest or logged-in)

      const questionsResponse = await axiosInstance.get(`/questions/${category}/${userId}`, {
        params: { page: currentPage, limit: 5 },
      });

      console.log("Questions Response:", questionsResponse.data); // Log API response for questions

      if (questionsResponse.data && questionsResponse.data.questions) {
        setQuestions(questionsResponse.data.questions);
        setTotalPage(questionsResponse.data.totalPages);
      } else {
        setError("Failed to load questions.");
        console.error("Failed to load questions."); // Log if no questions returned
      }

      if (!guestUser) {
        const scoreResponse = await axiosInstance.get(`/user-score/${user.userId}/${category}`);
        console.log("Score Response:", scoreResponse.data); // Log API response for user score
        if (scoreResponse.data.userScore) {
          const { score, correctAnswer, inCorrectAnswer } = scoreResponse.data.userScore;
          setScore(score || 0);
          setCorrectAnswers(correctAnswer || []);
          setIncorrectAnswers(inCorrectAnswer || []);
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error.message); // Log any errors during the fetch
      if (guestUser && error.response?.status === 401) {
        setError("Guest users are not authorized for this action.");
      } else {
        setError("Failed to load questions.");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prevPage) => prevPage + 1);
      console.log("Moving to next page:", currentPage + 1); // Log page navigation
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      console.log("Moving to previous page:", currentPage - 1); // Log page navigation
    }
  };

  useEffect(() => {
    console.log("Category or page changed. Fetching new data...");
    fetchData();
  }, [category, currentPage]);

  const handleSubmit = async (questionIndex, selectedOption) => {
    const questionId = questions[questionIndex]._id;
    console.log(`Submitting answer for question ID: ${questionId}, selected option: ${selectedOption}`); // Log question submission
    if (submittedAnswers[questionId]) {
      console.log("Answer already submitted for this question."); // Log if already answered
      return;
    }

    const isCorrect = Math.random() > 0.5; // Simulate correctness for guest users
    const feedbackMessage = isCorrect ? "Correct answer!" : "Incorrect answer.";
    const newScore = isCorrect ? score + 10 : score;

    console.log("Feedback message:", feedbackMessage); // Log feedback message
    console.log("New score after submission:", newScore); // Log new score

    setFeedback((prev) => ({ ...prev, [questionId]: feedbackMessage }));
    setSubmittedAnswers((prev) => ({ ...prev, [questionId]: { submitted: true } }));
    setScore(newScore);
    setCorrectAnswers((prev) => (isCorrect ? [...prev, questionId] : prev));
    setIncorrectAnswers((prev) => (!isCorrect ? [...prev, questionId] : prev));

    if (guestUser) {
      console.log("Updating guest user score...");
      updateGuestUserScore(category, newScore);
    } else {
      try {
        await axiosInstance.post("/submit", {
          userId: user.userId,
          questionId,
          selectedOption,
        });
        console.log("Answer submitted successfully to server."); // Log successful answer submission
      } catch (error) {
        setFeedback((prev) => ({
          ...prev,
          [questionId]: "There was an error submitting your answer.",
        }));
        console.error("Error submitting answer:", error.message); // Log submission error
      }
    }
  };

  return (
    <div className={`p-6 min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <h2 className={`text-2xl sm:text-2xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-black'}`}>
        Questions for {category}
      </h2>
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="loader">Loading...</div>
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <div key={question._id} className="mb-4">
            <p className="font-semibold text-lg">{question.content}</p>
            <div className="flex flex-col">
              {question.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  className={`py-2 px-4 mt-2 ${submittedAnswers[question._id]?.submitted ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
                  onClick={() => handleSubmit(index, option)}
                  disabled={submittedAnswers[question._id]?.submitted}
                >
                  {option}
                </button>
              ))}
            </div>
            {feedback[question._id] && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{feedback[question._id]}</p>
            )}
          </div>
        ))
      ) : (
        <div>No questions available for this category.</div>
      )}
      <div className="flex justify-between items-center mt-6">
        <button onClick={prevPage} disabled={currentPage === 1} className="text-blue-500 hover:underline">
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPage}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPage}
          className="text-blue-500 hover:underline"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CategoryPage;
