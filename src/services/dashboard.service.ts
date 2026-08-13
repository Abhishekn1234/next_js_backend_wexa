import { database } from "../config/database.js";

class DashboardService {
  async getDashboardStats() {
    const session = database.getSession();

    try {
      const result = await session.executeRead((tx) =>
        tx.run(`
          MATCH (d:Developer)
          WITH count(d) AS developers

          MATCH (j:Job)
          WITH developers, count(j) AS jobs

          MATCH (s:Skill)
          WITH developers, jobs, count(s) AS skills

          MATCH (p:Project)
          WITH developers, jobs, skills, count(p) AS projects

          RETURN developers, jobs, skills, projects
        `)
      );

      const record = result.records[0];

      const developers = record.get("developers").toNumber();
      const jobs = record.get("jobs").toNumber();
      const skills = record.get("skills").toNumber();
      const projects = record.get("projects").toNumber();

      // Relationship statistics
      const relationshipResult = await session.executeRead((tx) =>
        tx.run(`
          OPTIONAL MATCH ()-[hs:HAS_SKILL]->()
          WITH count(hs) AS hasSkill

          OPTIONAL MATCH ()-[r:REQUIRES]->()
          WITH hasSkill, count(r) AS requires

          OPTIONAL MATCH ()-[us:USES_SKILL]->()
          WITH hasSkill, requires, count(us) AS usesSkill

          OPTIONAL MATCH ()-[wo:WORKED_ON]->()
          RETURN
            hasSkill,
            requires,
            usesSkill,
            count(wo) AS workedOn
        `)
      );

      const relationshipRecord =
        relationshipResult.records[0];

      const hasSkill =
        relationshipRecord.get("hasSkill").toNumber();

      const requires =
        relationshipRecord.get("requires").toNumber();

      const usesSkill =
        relationshipRecord.get("usesSkill").toNumber();

      const workedOn =
        relationshipRecord.get("workedOn").toNumber();

      // Project status
      const projectStatusResult = await session.executeRead(
        (tx) =>
          tx.run(`
            MATCH (p:Project)
            RETURN
              count(CASE
                WHEN p.status = 'ONGOING'
                THEN 1
              END) AS ongoing,

              count(CASE
                WHEN p.status = 'COMPLETED'
                THEN 1
              END) AS completed
          `)
      );

      const projectStatusRecord =
        projectStatusResult.records[0];

      const ongoing =
        projectStatusRecord.get("ongoing").toNumber();

      const completed =
        projectStatusRecord.get("completed").toNumber();

      const totalProjects = ongoing + completed;

      // Employment types
      const employmentResult = await session.executeRead(
        (tx) =>
          tx.run(`
            MATCH (j:Job)
            RETURN
              j.employmentType AS type,
              count(j) AS count
            ORDER BY count DESC
          `)
      );

      const employmentTypes =
        employmentResult.records.map((record) => ({
          type: record.get("type"),
          count: record.get("count").toNumber(),
        }));

      return {
        developers,
        jobs,
        skills,
        projects,

        relationships: {
          hasSkill,
          requires,
          usesSkill,
          workedOn,
        },

        projectStatus: {
          ongoing,
          completed,

          ongoingPercent:
            totalProjects > 0
              ? Math.round(
                  (ongoing / totalProjects) * 100
                )
              : 0,

          completedPercent:
            totalProjects > 0
              ? Math.round(
                  (completed / totalProjects) * 100
                )
              : 0,
        },

        employmentTypes,
      };
    } finally {
      await session.close();
    }
  }
}

export const dashboardService =
  new DashboardService();