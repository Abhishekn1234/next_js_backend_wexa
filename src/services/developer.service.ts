import { database } from "../config/database.js";
import { developerQueries } from "../queries/developer.queries.js";
import neo4j from "neo4j-driver";
class DeveloperService {
 async getAllDevelopers(
  page = 1,
  limit = 10,
  search = ""
) {
  const session = database.getDriver().session();

  try {
    const skip = (page - 1) * limit;

    const result = await session.run(
      `
      MATCH (d:Developer)

      WHERE
        $search = ""
        OR toLower(coalesce(d.name, "")) CONTAINS toLower($search)
        OR toLower(coalesce(d.email, "")) CONTAINS toLower($search)
        OR toLower(coalesce(d.location, "")) CONTAINS toLower($search)

      RETURN d
      ORDER BY d.createdAt DESC
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
      MATCH (d:Developer)

      WHERE
        $search = ""
        OR toLower(coalesce(d.name, "")) CONTAINS toLower($search)
        OR toLower(coalesce(d.email, "")) CONTAINS toLower($search)
        OR toLower(coalesce(d.location, "")) CONTAINS toLower($search)

      RETURN count(d) AS total
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
      (record) => record.get("d").properties
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

  async getDeveloperById(developerId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        developerQueries.getById,
        {
          developerId,
        }
      );

      if (result.records.length === 0) {
        return null;
      }

      return result.records[0].get("d").properties;
    } finally {
      await session.close();
    }
  }

  async getDeveloperSkills(developerId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        developerQueries.getSkills,
        {
          developerId,
        }
      );

      return result.records.map((record) => {
        const skill = record.get("s");

        return {
          ...skill.properties,
          level: record.get("level"),
          yearsOfExperience: record.get("yearsOfExperience"),
        };
      });
    } finally {
      await session.close();
    }
  }

  async getDeveloperProjects(developerId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        developerQueries.getProjects,
        {
          developerId,
        }
      );

      return result.records.map((record) => {
        const project = record.get("p");

        return {
          ...project.properties,
          role: record.get("role"),
        };
      });
    } finally {
      await session.close();
    }
  }

  async getDeveloperCompanies(developerId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        developerQueries.getCompanies,
        {
          developerId,
        }
      );

      return result.records.map((record) => {
        const company = record.get("c");

        return {
          ...company.properties,
          role: record.get("role"),
          startDate: record.get("startDate"),
        };
      });
    } finally {
      await session.close();
    }
  }

  async getDevelopersBySkill(skillId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        developerQueries.getBySkillThroughProjects,
        {
          skillId,
        }
      );

      return result.records.map((record) => {
        const developer = record.get("d");

        return {
          ...developer.properties,
          projects: record.get("projects"),
          projectCount: record.get("projectCount").toNumber(),
        };
      });
    } finally {
      await session.close();
    }
  }
}

export const developerService = new DeveloperService();