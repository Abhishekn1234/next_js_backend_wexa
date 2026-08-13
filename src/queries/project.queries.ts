export const projectQueries = {
  getAll: `
    MATCH (p:Project)
    RETURN p
    ORDER BY p.name
  `,

  getById: `
    MATCH (p:Project {id: $projectId})
    RETURN p
  `,

  getSkills: `
    MATCH (p:Project {id: $projectId})
          -[:USES_SKILL]->(s:Skill)
    RETURN s
    ORDER BY s.name
  `,

  getDevelopers: `
    MATCH (d:Developer)-[r:WORKED_ON]->(p:Project {id: $projectId})
    RETURN
      d,
      r.role AS role
    ORDER BY d.name
  `,
};