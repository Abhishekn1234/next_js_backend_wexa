import { Request, Response } from "express";
import {
  recommendationService,
} from "../services/recommendation.service.js";

class RecommendationController {
  async getJobsForDeveloper(
    req: Request,
    res: Response
  ) {
    try {
      const developerId =
        String(req.params.developerId);

      const jobs =
        await recommendationService.getJobsForDeveloper(
          developerId
        );

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
          "Failed to generate job recommendations",
      });
    }
  }

  async getRelatedSkillJobs(
    req: Request,
    res: Response
  ) {
    try {
      const developerId =
        String(req.params.developerId);

      const jobs =
        await recommendationService.getRelatedSkillJobs(
          developerId
        );

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
          "Failed to generate related skill recommendations",
      });
    }
  }

  async getDevelopersForJob(
    req: Request,
    res: Response
  ) {
    try {
      const jobId =
        String(req.params.jobId);

      const developers =
        await recommendationService.getDevelopersForJob(
          jobId
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
          "Failed to find matching developers",
      });
    }
  }

  async getSimilarDevelopers(
    req: Request,
    res: Response
  ) {
    try {
      const developerId =
        String(req.params.developerId);

      const developers =
        await recommendationService.getSimilarDevelopers(
          developerId
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
          "Failed to find similar developers",
      });
    }
  }
}

export const recommendationController =
  new RecommendationController();