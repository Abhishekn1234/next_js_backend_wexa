import { database } from "../config/database.js";
import { skillQueries } from "../queries/skill.queries.js";
import neo4j from "neo4j-driver";
class SkillService {
 async getAllSkills(
  page = 1,
  limit = 10,
  search = ""
) {
  const session = database.getDriver().session();

  try {
    const skip = (page - 1) * limit;

    const result = await session.run(
      `
      MATCH (s:Skill)

      WHERE
        $search = ""
        OR toLower(s.name) CONTAINS toLower($search)

      RETURN s
      ORDER BY s.name ASC
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
      MATCH (s:Skill)

      WHERE
        $search = ""
        OR toLower(s.name) CONTAINS toLower($search)

      RETURN count(s) AS total
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
      (record) => record.get("s").properties
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
  async getSkillById(skillId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        skillQueries.getById,
        {
          skillId,
        }
      );

      if (result.records.length === 0) {
        return null;
      }

      return result.records[0].get("s").properties;
    } finally {
      await session.close();
    }
  }

  async getRelatedSkills(skillId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        skillQueries.getRelatedSkills,
        {
          skillId,
        }
      );

      return result.records.map((record) => {
        return {
          ...record.get("related").properties,
          strength: record.get("strength"),
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
        skillQueries.getDevelopers,
        {
          skillId,
        }
      );

      return result.records.map((record) => {
        return {
          ...record.get("d").properties,
          level: record.get("level"),
          yearsOfExperience: record
            .get("yearsOfExperience"),
        };
      });
    } finally {
      await session.close();
    }
  }

  async getJobsBySkill(skillId: string) {
    const session = database.getDriver().session();

    try {
      const result = await session.run(
        skillQueries.getJobs,
        {
          skillId,
        }
      );

      return result.records.map((record) => {
        return {
          ...record.get("j").properties,
          importance: record.get("importance"),
        };
      });
    } finally {
      await session.close();
    }
  }
}

export const skillService = new SkillService();