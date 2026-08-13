import { Request, Response } from "express";
import { projectService } from "../services/project.service.js";

class ProjectController {
 async getAllProjects(req: Request, res: Response) {
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
      await projectService.getAllProjects(
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
        "Failed to fetch projects",
    });
  }
}
  async getProjectById(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const project =
        await projectService.getProjectById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch project",
      });
    }
  }

  async getProjectSkills(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const skills =
        await projectService.getProjectSkills(id);

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
          "Failed to fetch project skills",
      });
    }
  }

  async getProjectDevelopers(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const developers =
        await projectService.getProjectDevelopers(id);

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
          "Failed to fetch project developers",
      });
    }
  }
}

export const projectController =
  new ProjectController();