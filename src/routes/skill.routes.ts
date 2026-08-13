import { Router } from "express";
import { skillController } from "../controllers/skill.controller.js";

const router = Router();

router.get(
  "/",
  skillController.getAllSkills.bind(skillController)
);

router.get(
  "/:id",
  skillController.getSkillById.bind(skillController)
);

router.get(
  "/:id/related",
  skillController.getRelatedSkills.bind(skillController)
);

router.get(
  "/:id/developers",
  skillController.getDevelopersBySkill.bind(skillController)
);

router.get(
  "/:id/jobs",
  skillController.getJobsBySkill.bind(skillController)
);

export default router;