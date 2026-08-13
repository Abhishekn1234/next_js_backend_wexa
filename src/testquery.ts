import { database } from "./config/database.js";

const testQuery = async () => {
  const driver = database.getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Developer {id: $developerId})
            -[:HAS_SKILL]->(s:Skill)

      MATCH (j:Job)
            -[:REQUIRES]->(s)

      OPTIONAL MATCH (c:Company)-[:POSTED]->(j)

      WITH
        d,
        j,
        c,
        COUNT(DISTINCT s) AS matchedSkills

      RETURN
        d.name AS developer,
        j.title AS job,
        c.name AS company,
        matchedSkills

      ORDER BY matchedSkills DESC, j.createdAt DESC
      `,
      {
        developerId: "DEV001",
      }
    );

    console.log("\n🎯 Job recommendations for DEV001:\n");

    for (const record of result.records) {
      console.log({
        developer: record.get("developer"),
        job: record.get("job"),
        company: record.get("company"),
        matchedSkills: record.get("matchedSkills").toNumber(),
      });
    }
  } catch (error) {
    console.error("❌ Query failed");
    console.error(error);
  } finally {
    await session.close();
    await database.close();
  }
};

testQuery();