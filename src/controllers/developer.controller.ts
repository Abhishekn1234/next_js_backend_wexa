import { Request, Response } from "express";
import { developerService } from "../services/developer.service.js";

class DeveloperController {
  async getAllDevelopers(
  req: Request,
  res: Response
) {
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

    const result =
      await developerService.getAllDevelopers(
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
        error.message ||
        "Failed to fetch developers",
    });
  }
}

  async getDeveloperById(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const developer =
        await developerService.getDeveloperById(id);

      if (!developer) {
        return res.status(404).json({
          success: false,
          message: "Developer not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: developer,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch developer",
      });
    }
  }

  async getDeveloperSkills(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const skills =
        await developerService.getDeveloperSkills(id);

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
          "Failed to fetch developer skills",
      });
    }
  }

  async getDeveloperProjects(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const projects =
        await developerService.getDeveloperProjects(id);

      return res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch developer projects",
      });
    }
  }

  async getDeveloperCompanies(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const companies =
        await developerService.getDeveloperCompanies(id);

      return res.status(200).json({
        success: true,
        data: companies,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch developer companies",
      });
    }
  }

  async getDevelopersBySkill(
    req: Request,
    res: Response
  ) {
    try {
      const skillId = String(req.params.skillId);

      const developers =
        await developerService.getDevelopersBySkill(
          skillId
        );

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
}

export const developerController =
  new DeveloperController();