import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../utills/axios.js";
import { useTheme } from "./ThemeContext.jsx";
import { GuestUserContext } from "../guestuser/GuestuserContext.jsx";


function CategoryPage() {
  const { guestUser, updateGuestUserScore } = useContext(GuestUserContext);

  const { token, user } = useSelector((state) => state.user);
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showAnswers, setShowAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const { isDark } = useTheme();

  const fetchData = async () => {
    try {
      setLoading(true);

      if (guestUser.isGuest) {
        // Handle guest user data 
        const guestQuestionsResponse = await axiosInstance.get(
          `/questions/${category}/guest`,
          {
            params: { page: currentPage, limit: 5 },
          }
        );
        if (
          guestQuestionsResponse.data &&
          guestQuestionsResponse.data.questions
        ) {
          setQuestions(guestQuestionsResponse.data.questions);
          setTotalPage(guestQuestionsResponse.data.totalPages);
          setPendingQuestions(
            guestQuestionsResponse.data.pendingAnswerCount || 0
          );
        } else {
          setError("Failed to load questions for guest user.");
        }

        return; // Exit fetchData for guest users
      }

      const questionsResponse = await axiosInstance.get(
        `/questions/${category}/${user.userId}`,
        { params: { page: currentPage, limit: 5 } }
      );

      if (questionsResponse.data && questionsResponse.data.questions) {
        setQuestions(questionsResponse.data.questions);
        setTotalPage(questionsResponse.data.totalPages);
        setPendingQuestions(questionsResponse.data.pendingAnswerCount);
      } else {
        setError("Failed to load questions.");
      }

      const scoreResponse = await axiosInstance.get(
        `/user-score/${user.userId}/${category}`
      );
      if (scoreResponse.data.userScore) {
        const {
          score,
          correctAnswer,
          inCorrectAnswer,
          answeredQuestions,
          pendingAnswer,
        } = scoreResponse.data.userScore;
        setScore(score || 0);
        setCorrectAnswers(correctAnswer || []);
        setIncorrectAnswers(inCorrectAnswer || []);
        setPendingQuestions(pendingAnswer.length || 0);
        setAnsweredQuestions(answeredQuestions || []);

        const feedbackMap = {};
        scoreResponse.data.userScore.answers.forEach((ans) => {
          feedbackMap[ans.questionId] = ans.isCorrect
            ? "Correct answer!"
            : "Incorrect answer.";
        });
        setFeedback(feedbackMap);
      }
    } catch (error) {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    if (guestUser.isGuest || (user && token)) {
      fetchData();
    } else {
      navigate("/");
    }
  }, [category, user, token, currentPage, guestUser.isGuest]);

  const handleSubmit = async (questionIndex, selectedOption) => {
    const questionId = questions[questionIndex]._id;
    if (submittedAnswers[questionId]) {
      return;
    }

    try {
      const response = await axiosInstance.post("/answersubmit", {
        userId: user.userId,  
        questionId,
        selectedOption,
      });

      const { isCorrect, updatedScore, feedbackMessage } = response.data;

      setFeedback((prev) => ({ ...prev, [questionId]: feedbackMessage }));
      setSubmittedAnswers((prev) => ({
        ...prev,
        [questionId]: { submitted: true, clicked: false },
      }));
      setScore(updatedScore);
      setCorrectAnswers((prev) => (isCorrect ? [...prev, questionId] : prev));
      setIncorrectAnswers((prev) =>
        !isCorrect ? [...prev, questionId] : prev
      );
    } catch (error) {
      setFeedback((prev) => ({
        ...prev,
        [questionId]: "There was an error submitting your answer.",
      }));
    }
  };

  const handleShowAnswer = (questionIndex) => {
    const questionId = questions[questionIndex]._id;

    setShowAnswers((prev) => ({
      ...prev,
      [questionIndex]: true,
    }));
    setSubmittedAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        clicked: true,
      },
    }));
  };

  const handleGuestUserScoreUpdate = (
    questionId,
    selectedOption,
    isCorrect
  ) => {
    if (guestUser.isGuest) {
      updateGuestUserScore(questionId, selectedOption, isCorrect);
    }
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      } flex flex-col sm:flex-wrap`}
    >
      <h2
        className={`text-2xl sm:text-2xl font-bold mb-6 text-center ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        Questions for {category}
      </h2>
      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading questions...
        </div>
      )}
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((question, index) => {
            const isAnswered = answeredQuestions.includes(question._id);
            return (
              <div
                key={question._id}
                className={`p-6 rounded-lg shadow-md ${
                  isDark ? "bg-gray-800 text-white" : "bg-white text-black"
                } flex flex-col space-y-4`}
              >
                <h3 className="text-lg font-semibold mb-4">
                  {question.questionText}
                </h3>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                  {question.options[0].map((option, i) => {
                    const optionLabel = String.fromCharCode(65 + i);
                    return (
                      <div key={i} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          id={`option-${index}-${i}`}
                          value={optionLabel}
                          disabled={isAnswered}
                          onChange={(e) => {
                            const selectedOption = e.target.value;
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [question._id]: selectedOption,
                            }));
                          }}
                          className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`option-${index}-${i}`}
                          className="ml-2"
                        >
                          {optionLabel}. {option}
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap justify-between items-center mt-4 space-x-4">
                  <button
                    onClick={() => {
                      const selectedOption = selectedAnswers[question._id];
                      if (selectedOption) {
                        const isCorrect =
                          selectedOption === question.correctAnswer;
                        handleSubmit(index, selectedOption);
                        handleGuestUserScoreUpdate(
                          question._id,
                          selectedOption,
                          isCorrect
                        );
                      } else {
                        alert("Please select an option before submitting");
                      }
                    }}
                    className={`flex-1 sm:flex-none w-full sm:w-auto text-center py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all ${
                      submittedAnswers[question._id]?.submitted
                        ? `bg-gray-400 ${
                            isDark ? "text-black" : "text-gray-700"
                          } cursor-not-allowed`
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={submittedAnswers[question._id]?.submitted}
                  >
                    Submit
                  </button>

                  <button
                    onClick={() => handleShowAnswer(index)}
                    className={`flex-1 sm:flex-none w-full sm:w-auto text-center py-2 px-4 rounded-lg ${
                      submittedAnswers[question._id]?.submitted &&
                      !submittedAnswers[question._id]?.clicked
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : `bg-gray-400 ${
                            isDark ? "text-black" : "text-gray-700"
                          } cursor-not-allowed`
                    }`}
                    disabled={
                      !submittedAnswers[question._id]?.submitted ||
                      submittedAnswers[question._id]?.clicked
                    }
                  >
                    {showAnswers[index] ? "Hide Answer" : "Show Answer"}
                  </button>
                </div>

                <span
                  className={`font-medium mt-2 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {feedback[question._id]}
                </span>

                {showAnswers[index] && (
                  <div className="mt-2">
                    <strong>Correct Answer:</strong> {question.correctAnswer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No questions available for this category.
          </div>
        )}
      </div>

      <div className="w-full flex justify-end items-center mt-6 space-x-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-6 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <p>
          Page {currentPage} of {totalPage}
        </p>
        <button
          onClick={nextPage}
          disabled={currentPage >= totalPage}
          className="px-6 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="mt-12 w-full">
        <h3 className="text-lg font-bold dark:text-white">Your Score</h3>
        <p className={isDark ? "text-gray-200" : "text-black"}>
          Your score: {score}
        </p>
        <p className={isDark ? "text-gray-200" : "text-black"}>
          Correct answers: {correctAnswers.length}
        </p>
        <p className={isDark ? "text-gray-200" : "text-black"}>
          Incorrect answers: {incorrectAnswers.length}
        </p>
        <p className={isDark ? "text-gray-200" : "text-black"}>
          Pending questions: {pendingQuestions}
        </p>
      </div>
    </div>
  );
}

export default CategoryPage;
