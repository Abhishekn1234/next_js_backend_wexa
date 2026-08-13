import { Router } from "express";
import {
  recommendationController,
} from "../controllers/recommendation.controller.js";

const router = Router();

router.get(
  "/developers/:developerId/jobs",
  recommendationController.getJobsForDeveloper.bind(
    recommendationController
  )
);

router.get(
  "/developers/:developerId/related-jobs",
  recommendationController.getRelatedSkillJobs.bind(
    recommendationController
  )
);

router.get(
  "/jobs/:jobId/developers",
  recommendationController.getDevelopersForJob.bind(
    recommendationController
  )
);

router.get(
  "/developers/:developerId/similar",
  recommendationController.getSimilarDevelopers.bind(
    recommendationController
  )
);

export default router;