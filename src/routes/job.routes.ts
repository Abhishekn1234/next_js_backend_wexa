import { Router } from "express";
import { jobController } from "../controllers/job.controller.js";

const router = Router();

router.get(
  "/",
  jobController.getAllJobs.bind(jobController)
);

router.get(
  "/:id",
  jobController.getJobById.bind(jobController)
);

router.get(
  "/:id/skills",
  jobController.getJobSkills.bind(jobController)
);

router.get(
  "/:id/company",
  jobController.getJobCompany.bind(jobController)
);

export default router;