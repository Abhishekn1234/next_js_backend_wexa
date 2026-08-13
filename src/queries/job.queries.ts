export const jobQueries = {
  getAll: `
    MATCH (j:Job)
    OPTIONAL MATCH (c:Company)-[:POSTED]->(j)
    RETURN
      j,
      c
    ORDER BY j.createdAt DESC
  `,

  getById: `
    MATCH (j:Job {id: $jobId})
    OPTIONAL MATCH (c:Company)-[:POSTED]->(j)
    RETURN
      j,
      c
  `,

  getSkills: `
    MATCH (j:Job {id: $jobId})
          -[r:REQUIRES]->(s:Skill)
    RETURN
      s,
      r.importance AS importance
    ORDER BY s.name
  `,

  getCompany: `
    MATCH (c:Company)-[:POSTED]->(j:Job {id: $jobId})
    RETURN c
  `,
};