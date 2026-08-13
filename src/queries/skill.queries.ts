export const skillQueries = {
  getAll: `
    MATCH (s:Skill)
    RETURN s
    ORDER BY s.name
  `,

  getById: `
    MATCH (s:Skill {id: $skillId})
    RETURN s
  `,

  getRelatedSkills: `
    MATCH (s:Skill {id: $skillId})
          -[r:RELATED_TO]->(related:Skill)
    RETURN
      related,
      r.strength AS strength
    ORDER BY r.strength DESC
  `,

  getDevelopers: `
    MATCH (d:Developer)-[r:HAS_SKILL]->(s:Skill {id: $skillId})
    RETURN
      d,
      r.level AS level,
      r.yearsOfExperience AS yearsOfExperience
    ORDER BY r.yearsOfExperience DESC
  `,

  getJobs: `
    MATCH (j:Job)-[r:REQUIRES]->(s:Skill {id: $skillId})
    RETURN
      j,
      r.importance AS importance
    ORDER BY j.createdAt DESC
  `,
};