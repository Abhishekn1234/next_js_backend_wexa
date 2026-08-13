import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";

class DashboardController {
  async getDashboardStats(
    _req: Request,
    res: Response
  ) {
    try {
      const stats =
        await dashboardService.getDashboardStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch dashboard statistics",
      });
    }
  }
}

export const dashboardController =
  new DashboardController();