export const developerQueries = {
  getAll: `
    MATCH (d:Developer)
    RETURN d
    ORDER BY d.name
  `,

  getById: `
    MATCH (d:Developer {id: $developerId})
    RETURN d
  `,

  getSkills: `
    MATCH (d:Developer {id: $developerId})
          -[r:HAS_SKILL]->(s:Skill)
    RETURN
      s,
      r.level AS level,
      r.yearsOfExperience AS yearsOfExperience
    ORDER BY s.name
  `,

  getProjects: `
    MATCH (d:Developer {id: $developerId})
          -[r:WORKED_ON]->(p:Project)
    RETURN
      p,
      r.role AS role
    ORDER BY p.name
  `,

  getCompanies: `
    MATCH (d:Developer {id: $developerId})
          -[r:WORKED_AT]->(c:Company)
    RETURN
      c,
      r.role AS role,
      r.startDate AS startDate
    ORDER BY c.name
  `,
  getBySkillThroughProjects: `
  MATCH (d:Developer)
        -[:WORKED_ON]->(p:Project)
        -[:USES_SKILL]->(s:Skill {id: $skillId})

  RETURN
    d,
    COLLECT(DISTINCT p.name) AS projects,
    COUNT(DISTINCT p) AS projectCount

  ORDER BY projectCount DESC
`,
};