import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";

const router = Router();

router.get(
  "/",
  projectController.getAllProjects.bind(projectController)
);

router.get(
  "/:id",
  projectController.getProjectById.bind(projectController)
);

router.get(
  "/:id/skills",
  projectController.getProjectSkills.bind(projectController)
);

router.get(
  "/:id/developers",
  projectController.getProjectDevelopers.bind(projectController)
);

export default router;