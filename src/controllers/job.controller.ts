import { Request, Response } from "express";
import { jobService } from "../services/job.service.js";

class JobController {
 async getAllJobs(req: Request, res: Response) {
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

    const result = await jobService.getAllJobs(
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
        error.message || "Failed to fetch jobs",
    });
  }
}

  async getJobById(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const job =
        await jobService.getJobById(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch job",
      });
    }
  }

  async getJobSkills(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const skills =
        await jobService.getJobSkills(id);

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
          "Failed to fetch job skills",
      });
    }
  }

  async getJobCompany(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const company =
        await jobService.getJobCompany(id);

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found for this job",
        });
      }

      return res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch job company",
      });
    }
  }
}

export const jobController =
  new JobController();