import { database } from "../config/database";
import { Company } from "../models/company.model";

class CompanyService {
  private driver = database.getDriver();

  async getAllCompanies(): Promise<Company[]> {
    const session = this.driver.session();

    try {
      const result = await session.run(`
        MATCH (c:Company)
        RETURN c
        ORDER BY c.name
      `);

      return result.records.map(
        (record) => record.get("c").properties as Company
      );
    } finally {
      await session.close();
    }
  }

  async getCompanyJobs(companyId: string) {
    const session = this.driver.session();

    try {
      const result = await session.run(
        `
        MATCH (c:Company {id: $companyId})
              -[:POSTED]->(j:Job)
        RETURN j
        ORDER BY j.createdAt DESC
        `,
        {
          companyId,
        }
      );

      return result.records.map(
        (record) => record.get("j").properties
      );
    } finally {
      await session.close();
    }
  }
}

export default new CompanyService();