export const recommendationQueries = {
  jobsForDeveloper: `
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
      j,
      c,
      matchedSkills

    ORDER BY matchedSkills DESC, j.createdAt DESC
  `,

  relatedSkillJobs: `
    MATCH (d:Developer {id: $developerId})
          -[:HAS_SKILL]->(s:Skill)

    MATCH (s)-[:RELATED_TO]->(relatedSkill:Skill)

    MATCH (j:Job)
          -[:REQUIRES]->(relatedSkill)

    OPTIONAL MATCH (c:Company)-[:POSTED]->(j)

    WITH
      j,
      c,
      COLLECT(DISTINCT relatedSkill.name) AS relatedSkills,
      COUNT(DISTINCT relatedSkill) AS matchedRelatedSkills

    RETURN
      j,
      c,
      relatedSkills,
      matchedRelatedSkills

    ORDER BY matchedRelatedSkills DESC
  `,

  developersForJob: `
    MATCH (j:Job {id: $jobId})
          -[:REQUIRES]->(s:Skill)

    MATCH (d:Developer)
          -[:HAS_SKILL]->(s)

    WITH
      d,
      j,
      COUNT(DISTINCT s) AS matchedSkills

    RETURN
      d,
      matchedSkills

    ORDER BY matchedSkills DESC
  `,

  similarDevelopers: `
    MATCH (d:Developer {id: $developerId})
          -[:HAS_SKILL]->(s:Skill)

    MATCH (other:Developer)
          -[:HAS_SKILL]->(s)

    WHERE other.id <> d.id

    WITH
      other,
      COUNT(DISTINCT s) AS commonSkills

    RETURN
      other,
      commonSkills

    ORDER BY commonSkills DESC
  `,
};