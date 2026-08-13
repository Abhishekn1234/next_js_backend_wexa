import { database } from "../config/database";
import { companies, developers, jobs, projects, skills } from "./seedData";


const seedDatabase = async () => {
  const driver = database.getDriver();
  const session = driver.session();

  try {
    console.log("🌱 Starting database seed...");

    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    console.log("🧹 Existing graph cleared");

    await session.run(
      `
      UNWIND $developers AS developer

      CREATE (d:Developer {
        id: developer.id,
        name: developer.name,
        email: developer.email,
        location: developer.location,
        experienceYears: developer.experienceYears,
        bio: developer.bio,
        createdAt: developer.createdAt
      })
      `,
      {
        developers,
      }
    );

    console.log(`✅ Created ${developers.length} developers`);

    await session.run(
      `
      UNWIND $skills AS skill

      CREATE (s:Skill {
        id: skill.id,
        name: skill.name,
        category: skill.category
      })
      `,
      {
        skills,
      }
    );

    console.log(`✅ Created ${skills.length} skills`);

    await session.run(
      `
      UNWIND $companies AS company

      CREATE (c:Company {
        id: company.id,
        name: company.name,
        industry: company.industry,
        location: company.location,
        website: company.website,
        employeeCount: company.employeeCount
      })
      `,
      {
        companies,
      }
    );

    console.log(`✅ Created ${companies.length} companies`);

    await session.run(
      `
      UNWIND $projects AS project

      CREATE (p:Project {
        id: project.id,
        name: project.name,
        description: project.description,
        category: project.category,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate
      })
      `,
      {
        projects,
      }
    );

    console.log(`✅ Created ${projects.length} projects`);

    await session.run(
      `
      UNWIND $jobs AS job

      CREATE (j:Job {
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        employmentType: job.employmentType,
        minExperience: job.minExperience,
        maxExperience: job.maxExperience,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        createdAt: job.createdAt
      })
      `,
      {
        jobs,
      }
    );

    console.log(`✅ Created ${jobs.length} jobs`);

    await session.run(`
      MATCH (d:Developer {id: "DEV001"})
      MATCH (s:Skill {id: "SK003"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV001"})
      MATCH (s:Skill {id: "SK005"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV001"})
      MATCH (s:Skill {id: "SK002"})
      CREATE (d)-[:HAS_SKILL {
        level: "INTERMEDIATE",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV001"})
      MATCH (s:Skill {id: "SK008"})
      CREATE (d)-[:HAS_SKILL {
        level: "INTERMEDIATE",
        yearsOfExperience: 1
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV002"})
      MATCH (s:Skill {id: "SK003"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 3
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV002"})
      MATCH (s:Skill {id: "SK004"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV002"})
      MATCH (s:Skill {id: "SK018"})
      CREATE (d)-[:HAS_SKILL {
        level: "INTERMEDIATE",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV003"})
      MATCH (s:Skill {id: "SK005"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 4
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV003"})
      MATCH (s:Skill {id: "SK007"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 3
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV003"})
      MATCH (s:Skill {id: "SK012"})
      CREATE (d)-[:HAS_SKILL {
        level: "INTERMEDIATE",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV004"})
      MATCH (s:Skill {id: "SK010"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 4
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV004"})
      MATCH (s:Skill {id: "SK009"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 3
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV004"})
      MATCH (s:Skill {id: "SK017"})
      CREATE (d)-[:HAS_SKILL {
        level: "INTERMEDIATE",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV005"})
      MATCH (s:Skill {id: "SK001"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV005"})
      MATCH (s:Skill {id: "SK003"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV005"})
      MATCH (s:Skill {id: "SK005"})
      CREATE (d)-[:HAS_SKILL {
        level: "INTERMEDIATE",
        yearsOfExperience: 1
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV006"})
      MATCH (s:Skill {id: "SK002"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 3
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV006"})
      MATCH (s:Skill {id: "SK005"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV006"})
      MATCH (s:Skill {id: "SK007"})
      CREATE (d)-[:HAS_SKILL {
        level: "INTERMEDIATE",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV007"})
      MATCH (s:Skill {id: "SK003"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 5
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV007"})
      MATCH (s:Skill {id: "SK005"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 5
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV007"})
      MATCH (s:Skill {id: "SK010"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 4
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV008"})
      MATCH (s:Skill {id: "SK014"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 4
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV008"})
      MATCH (s:Skill {id: "SK015"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 3
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV009"})
      MATCH (s:Skill {id: "SK003"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 3
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV009"})
      MATCH (s:Skill {id: "SK004"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 2
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV010"})
      MATCH (s:Skill {id: "SK005"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 4
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV010"})
      MATCH (s:Skill {id: "SK009"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 3
      }]->(s)
    `);

    await session.run(`
      MATCH (d:Developer {id: "DEV010"})
      MATCH (s:Skill {id: "SK010"})
      CREATE (d)-[:HAS_SKILL {
        level: "ADVANCED",
        yearsOfExperience: 3
      }]->(s)
    `);

    console.log("✅ Developer skill relationships created");

    const skillRelations = [
      ["SK001", "SK002", 0.9],
      ["SK001", "SK003", 0.8],
      ["SK002", "SK003", 0.8],
      ["SK003", "SK004", 0.9],
      ["SK003", "SK018", 0.7],
      ["SK005", "SK006", 0.9],
      ["SK005", "SK012", 0.7],
      ["SK009", "SK017", 0.8],
      ["SK009", "SK020", 0.8],
      ["SK010", "SK017", 0.8],
      ["SK013", "SK007", 0.5],
      ["SK014", "SK015", 0.9],
    ];

    for (const [from, to, strength] of skillRelations) {
      await session.run(
        `
        MATCH (a:Skill {id: $from})
        MATCH (b:Skill {id: $to})
        CREATE (a)-[:RELATED_TO {
          strength: $strength
        }]->(b)
        `,
        {
          from,
          to,
          strength,
        }
      );
    }

    console.log("✅ Skill relationships created");

    const jobCompanies = [
      ["JOB001", "COMP001"],
      ["JOB002", "COMP003"],
      ["JOB003", "COMP002"],
      ["JOB004", "COMP005"],
      ["JOB005", "COMP001"],
      ["JOB006", "COMP002"],
      ["JOB007", "COMP006"],
      ["JOB008", "COMP007"],
      ["JOB009", "COMP004"],
      ["JOB010", "COMP006"],
      ["JOB011", "COMP003"],
      ["JOB012", "COMP006"],
      ["JOB013", "COMP005"],
      ["JOB014", "COMP004"],
      ["JOB015", "COMP008"],
    ];

    for (const [jobId, companyId] of jobCompanies) {
      await session.run(
        `
        MATCH (c:Company {id: $companyId})
        MATCH (j:Job {id: $jobId})
        CREATE (c)-[:POSTED {
          postedAt: j.createdAt
        }]->(j)
        `,
        {
          jobId,
          companyId,
        }
      );
    }

    console.log("✅ Company → Job relationships created");

    const jobSkills: Record<string, string[]> = {
      JOB001: ["SK003", "SK005", "SK002"],
      JOB002: ["SK003", "SK002", "SK018"],
      JOB003: ["SK005", "SK006", "SK007"],
      JOB004: ["SK004", "SK003", "SK002"],
      JOB005: ["SK005", "SK007", "SK016"],
      JOB006: ["SK010", "SK009", "SK017"],
      JOB007: ["SK009", "SK017", "SK020"],
      JOB008: ["SK002", "SK005", "SK007"],
      JOB009: ["SK001", "SK003", "SK005"],
      JOB010: ["SK002", "SK005", "SK007"],
      JOB011: ["SK014", "SK015", "SK007"],
      JOB012: ["SK013", "SK007", "SK016"],
      JOB013: ["SK003", "SK018", "SK004"],
      JOB014: ["SK005", "SK012", "SK007"],
      JOB015: ["SK005", "SK009", "SK010"],
    };

    for (const [jobId, skillIds] of Object.entries(jobSkills)) {
      for (const skillId of skillIds) {
        await session.run(
          `
          MATCH (j:Job {id: $jobId})
          MATCH (s:Skill {id: $skillId})
          CREATE (j)-[:REQUIRES {
            importance: "REQUIRED"
          }]->(s)
          `,
          {
            jobId,
            skillId,
          }
        );
      }
    }

    console.log("✅ Job → Skill relationships created");

    const developerCompanies = [
      ["DEV001", "COMP007"],
      ["DEV002", "COMP001"],
      ["DEV003", "COMP003"],
      ["DEV004", "COMP002"],
      ["DEV005", "COMP004"],
      ["DEV006", "COMP007"],
      ["DEV007", "COMP008"],
      ["DEV008", "COMP003"],
      ["DEV009", "COMP005"],
      ["DEV010", "COMP002"],
    ];

    for (const [developerId, companyId] of developerCompanies) {
      await session.run(
        `
        MATCH (d:Developer {id: $developerId})
        MATCH (c:Company {id: $companyId})
        CREATE (d)-[:WORKED_AT {
          role: "Software Engineer",
          startDate: "2024-01-01"
        }]->(c)
        `,
        {
          developerId,
          companyId,
        }
      );
    }

    console.log("✅ Developer → Company relationships created");

    const developerProjects = [
      ["DEV001", "PROJ001"],
      ["DEV001", "PROJ005"],
      ["DEV002", "PROJ001"],
      ["DEV002", "PROJ009"],
      ["DEV003", "PROJ003"],
      ["DEV003", "PROJ007"],
      ["DEV004", "PROJ004"],
      ["DEV005", "PROJ002"],
      ["DEV005", "PROJ006"],
      ["DEV006", "PROJ005"],
      ["DEV007", "PROJ004"],
      ["DEV007", "PROJ009"],
      ["DEV008", "PROJ003"],
      ["DEV008", "PROJ010"],
      ["DEV009", "PROJ006"],
      ["DEV010", "PROJ004"],
      ["DEV010", "PROJ008"],
    ];

    for (const [developerId, projectId] of developerProjects) {
      await session.run(
        `
        MATCH (d:Developer {id: $developerId})
        MATCH (p:Project {id: $projectId})
        CREATE (d)-[:WORKED_ON {
          role: "Developer"
        }]->(p)
        `,
        {
          developerId,
          projectId,
        }
      );
    }

    console.log("✅ Developer → Project relationships created");

    const projectSkills: Record<string, string[]> = {
      PROJ001: ["SK003", "SK005", "SK008"],
      PROJ002: ["SK003", "SK005", "SK007"],
      PROJ003: ["SK005", "SK007", "SK009"],
      PROJ004: ["SK010", "SK009", "SK017"],
      PROJ005: ["SK003", "SK005", "SK002"],
      PROJ006: ["SK004", "SK003", "SK007"],
      PROJ007: ["SK013", "SK007", "SK012"],
      PROJ008: ["SK005", "SK010", "SK009"],
      PROJ009: ["SK003", "SK005", "SK012"],
      PROJ010: ["SK005", "SK007", "SK016"],
    };

    for (const [projectId, skillIds] of Object.entries(projectSkills)) {
      for (const skillId of skillIds) {
        await session.run(
          `
          MATCH (p:Project {id: $projectId})
          MATCH (s:Skill {id: $skillId})
          CREATE (p)-[:USES_SKILL]->(s)
          `,
          {
            projectId,
            skillId,
          }
        );
      }
    }

    console.log("✅ Project → Skill relationships created");

    const counts = await session.run(`
      MATCH (n)
      RETURN labels(n)[0] AS label, count(n) AS count
      ORDER BY label
    `);

    console.log("\n📊 Node counts:");

    for (const record of counts.records) {
      console.log(
        `${record.get("label")}: ${record.get("count").toNumber()}`
      );
    }

    const relationships = await session.run(`
      MATCH ()-[r]->()
      RETURN type(r) AS relationship, count(r) AS count
      ORDER BY relationship
    `);

    console.log("\n🔗 Relationship counts:");

    for (const record of relationships.records) {
      console.log(
        `${record.get("relationship")}: ${record
          .get("count")
          .toNumber()}`
      );
    }

    console.log("\n🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seed failed");
    console.error(error);

    process.exitCode = 1;
  } finally {
    await session.close();
    await database.close();
  }
};

seedDatabase();