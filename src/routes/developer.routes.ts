import { Router } from "express";
import { developerController } from "../controllers/developer.controller.js";

const router = Router();

router.get("/", developerController.getAllDevelopers);

router.get("/:id", developerController.getDeveloperById);

router.get("/:id/skills", developerController.getDeveloperSkills);

router.get("/:id/projects", developerController.getDeveloperProjects);

router.get("/:id/companies", developerController.getDeveloperCompanies);

router.get("/skill/:skillId", developerController.getDevelopersBySkill);

export default router;