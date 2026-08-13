import { database } from "../config/database.js";
import { projectQueries } from "../queries/project.queries.js";
import neo4j from "neo4j-driver";
class ProjectService {
 async getAllProjects(
  page = 1,
  limit = 10,
  search = ""
) {
  const session = database.getDriver().session();

  try {
    const skip = (page - 1) * limit;

    const result = await session.run(
      `
      MATCH (p:Project)

      WHERE
        $search = ""
        OR toLower(p.name) CONTAINS toLower($search)
        OR toLower(p.description) CONTAINS toLower($search)
        OR toLower(p.status) CONTAINS toLower($search)

      RETURN p
      ORDER BY p.startDate DESC
      SKIP $skip
      LIMIT $limit
      `,
      {
        search,
        skip: neo4j.int(skip),
        limit: neo4j.int(limit),
      }
    );

    const countResult = await session.run(
      `
      MATCH (p:Project)

      WHERE
        $search = ""
        OR toLower(p.name) CONTAINS toLower($search)
        OR toLower(p.description) CONTAINS toLower($search)
        OR toLower(p.status) CONTAINS toLower($search)

      RETURN count(p) AS total
      `,
      {
        search,
      }
    );

    const total = countResult.records[0]
      .get("total")
      .toNumber();

    const totalPages = Math.ceil(total / limit);

    const data = result.records.map(
      (record) => record.get("p").properties
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

  async getProjectById(projectId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        projectQueries.getById,
        {
          projectId,
        }
      );

      if (result.records.length === 0) {
        return null;
      }

      return result.records[0].get("p").properties;
    } finally {
      await session.close();
    }
  }

  async getProjectSkills(projectId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        projectQueries.getSkills,
        {
          projectId,
        }
      );

      return result.records.map((record) => {
        return record.get("s").properties;
      });
    } finally {
      await session.close();
    }
  }

  async getProjectDevelopers(projectId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        projectQueries.getDevelopers,
        {
          projectId,
        }
      );

      return result.records.map((record) => {
        return {
          ...record.get("d").properties,
          role: record.get("role"),
        };
      });
    } finally {
      await session.close();
    }
  }
}

export const projectService = new ProjectService();