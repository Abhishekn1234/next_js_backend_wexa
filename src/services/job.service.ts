import { database } from "../config/database.js";
import { jobQueries } from "../queries/job.queries.js";
import neo4j from "neo4j-driver";
class JobService {
async getAllJobs(
  page = 1,
  limit = 10,
  search = ""
) {
  const session = database.getDriver().session();

  try {
    const skip = (page - 1) * limit;

    const result = await session.run(
      `
      MATCH (j:Job)
      WHERE
        $search = ""
        OR toLower(coalesce(j.title, "")) CONTAINS toLower($search)
        OR toLower(coalesce(j.company, "")) CONTAINS toLower($search)
        OR toLower(coalesce(j.location, "")) CONTAINS toLower($search)
        OR toLower(coalesce(j.employmentType, "")) CONTAINS toLower($search)

      RETURN j
      ORDER BY j.createdAt DESC
      SKIP $skip
      LIMIT $limit
      `,
      {
        search: search.trim(),
        skip: neo4j.int(skip),
        limit: neo4j.int(limit),
      }
    );

    const countResult = await session.run(
      `
      MATCH (j:Job)
      WHERE
        $search = ""
        OR toLower(coalesce(j.title, "")) CONTAINS toLower($search)
        OR toLower(coalesce(j.company, "")) CONTAINS toLower($search)
        OR toLower(coalesce(j.location, "")) CONTAINS toLower($search)
        OR toLower(coalesce(j.employmentType, "")) CONTAINS toLower($search)

      RETURN count(j) AS total
      `,
      {
        search: search.trim(),
      }
    );

    const total = countResult.records[0]
      .get("total")
      .toNumber();

    const totalPages = Math.ceil(total / limit);

    const data = result.records.map(
      (record) => record.get("j").properties
    );

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } finally {
    await session.close();
  }
}

  async getJobById(jobId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        jobQueries.getById,
        {
          jobId,
        }
      );

      if (result.records.length === 0) {
        return null;
      }

      const job = result.records[0].get("j");
      const company = result.records[0].get("c");

      return {
        ...job.properties,
        company: company
          ? company.properties
          : null,
      };
    } finally {
      await session.close();
    }
  }

  async getJobSkills(jobId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        jobQueries.getSkills,
        {
          jobId,
        }
      );

      return result.records.map((record) => {
        const skill = record.get("s");

        return {
          ...skill.properties,
          importance: record.get("importance"),
        };
      });
    } finally {
      await session.close();
    }
  }

  async getJobCompany(jobId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        jobQueries.getCompany,
        {
          jobId,
        }
      );

      if (result.records.length === 0) {
        return null;
      }

      return result.records[0].get("c").properties;
    } finally {
      await session.close();
    }
  }
}

export const jobService = new JobService();