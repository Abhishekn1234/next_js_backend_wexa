import { Request, Response } from "express";
import { skillService } from "../services/skill.service.js";

class SkillController {
 async getAllSkills(req: Request, res: Response) {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const result = await skillService.getAllSkills(
      page,
      limit,
      search
    );

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch skills",
    });
  }
}
  async getSkillById(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const skill =
        await skillService.getSkillById(id);

      if (!skill) {
        return res.status(404).json({
          success: false,
          message: "Skill not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: skill,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch skill",
      });
    }
  }

  async getRelatedSkills(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const skills =
        await skillService.getRelatedSkills(id);

      return res.status(200).json({
        success: true,
        data: skills,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch related skills",
      });
    }
  }

  async getDevelopersBySkill(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const developers =
        await skillService.getDevelopersBySkill(id);

      return res.status(200).json({
        success: true,
        data: developers,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch developers by skill",
      });
    }
  }

  async getJobsBySkill(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const jobs =
        await skillService.getJobsBySkill(id);

      return res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch jobs by skill",
      });
    }
  }
}

export const skillController =
  new SkillController();