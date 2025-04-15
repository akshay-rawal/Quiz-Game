
 import express from "express";
  import login from './routes/authRoutes/login.js';
  import signup from "./routes/authRoutes/signup.js";
  import logout from "./routes/authRoutes/logout.js";
  import mongoose from "mongoose";
  import dotenv from "dotenv";
  import cors from "cors";
  import home from "./routes/home.js";
  import answer from "./routes/question-answer/answer.js";
  import userScore from "./routes/userScore.js";
  import questionRoutes from "./routes/question/questionRoutes.js";
  import submitAnswerRoutes from './routes/submitAnswerRoutes.js';
  import sessionRoutes from './routes/authRoutes/sessionRoutes.js';
  import bodyParser from "body-parser";
  import getLeaderboard from "./routes/question-answer/leaderboard.js";
  import cookieParser from 'cookie-parser';
  import refreshRoutes from './routes/authRoutes/refreshRoutes.js';
  import deleteQuestion from './routes/question/deleteQuestion.js';
  import themeRoutes from './routes/themeContext.js';
  import guestUsers from './routes/guestUser/guestUsers.js';
  import path from "path";
  import { fileURLToPath } from "url";



  if (process.env.NODE_ENV !== "production") {

   dotenv.config();
  }
  


  // Utility to get __dirname in ES module scope
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  

  const app = express();

  // CORS Configuration
  app.use(
    cors({
      origin: [
        "https://quiz-game-tq1z.onrender.com",
        "http://localhost:4001", // Optional for React dev server
        "http://localhost:5173",
      ],
      allowedHeaders: ["Authorization", "Content-Type"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      optionsSuccessStatus: 200,

    })
  );

  // Middleware
  app.use(cookieParser());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // MongoDB Connection
  const mongoDb = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
      process.exit(1); // Exit the process if MongoDB fails to connect
    }
  };
  mongoDb();

  // Use routes
  app.use("/api/auth", login);
  app.use("/api/auth", signup);
  app.use("/api/auth", home);
  app.use("/api/auth", sessionRoutes);
  app.use('/api/auth', refreshRoutes);
  app.use("/api/auth", logout);
  app.use("/api", answer);
  app.use("/api", questionRoutes);
  app.use("/api", userScore);
  app.use("/api/auth", submitAnswerRoutes);
  console.log("Loading submitAnswerRoutes...");
  app.use("/api", getLeaderboard);
  app.use('/api', deleteQuestion);
  app.use('/api', themeRoutes);
  app.use('/api', guestUsers);

  // Serve React Frontend Static Build
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  // Serve index.html for all unmatched routes
  app.get("*", (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(500).send("Error serving the index.html");
      }
    });
  });

  // Port and Host Configuration
  const port = process.env.PORT || 4001;

  // Start the server
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);

  });
