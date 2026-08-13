import { database } from "../config/database.js";
import { recommendationQueries } from "../queries/recommendation.queries.js";

class RecommendationService {
  async getJobsForDeveloper(developerId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        recommendationQueries.jobsForDeveloper,
        {
          developerId,
        }
      );

      return result.records.map((record) => {
        const job = record.get("j");
        const company = record.get("c");

        return {
          job: job.properties,
          company: company
            ? company.properties
            : null,
          matchedSkills: record
            .get("matchedSkills")
            .toNumber(),
        };
      });
    } finally {
      await session.close();
    }
  }

  async getRelatedSkillJobs(developerId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        recommendationQueries.relatedSkillJobs,
        {
          developerId,
        }
      );

      return result.records.map((record) => {
        const job = record.get("j");
        const company = record.get("c");

        return {
          job: job.properties,
          company: company
            ? company.properties
            : null,
          relatedSkills: record.get("relatedSkills"),
          matchedRelatedSkills: record
            .get("matchedRelatedSkills")
            .toNumber(),
        };
      });
    } finally {
      await session.close();
    }
  }

  async getDevelopersForJob(jobId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        recommendationQueries.developersForJob,
        {
          jobId,
        }
      );

      return result.records.map((record) => {
        return {
          developer: record.get("d").properties,
          matchedSkills: record
            .get("matchedSkills")
            .toNumber(),
        };
      });
    } finally {
      await session.close();
    }
  }

  async getSimilarDevelopers(developerId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        recommendationQueries.similarDevelopers,
        {
          developerId,
        }
      );

      return result.records.map((record) => {
        return {
          developer: record.get("other").properties,
          commonSkills: record
            .get("commonSkills")
            .toNumber(),
        };
      });
    } finally {
      await session.close();
    }
  }
}

export const recommendationService =
  new RecommendationService();