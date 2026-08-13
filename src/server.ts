import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dashboardRoutes from "./routes/dashboard.routes";
import { database } from "./config/database.js";
import { env } from "./config/env.js";

import developerRoutes from "./routes/developer.routes.js";
import jobRoutes from "./routes/job.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import projectRoutes from "./routes/project.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to WEXA CognoDB API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      developers: "/api/developers",
      jobs: "/api/jobs",
      skills: "/api/skills",
      projects: "/api/projects",
      recommendations: "/api/recommendations",
    },
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "WEXA CognoDB API is running",
  });
});

app.use("/api/developers", developerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use(
  "/api/recommendations",
  recommendationRoutes
);

const startServer = async () => {
  try {
    await database.verifyConnection();

    app.listen(env.PORT, () => {
      console.log(
        `🚀 Server running at http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);

    process.exit(1);
  }
};

startServer();