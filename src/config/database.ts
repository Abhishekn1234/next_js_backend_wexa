import neo4j, { Driver, Session } from "neo4j-driver";
import { env } from "./env.js";

class Database {
  private driver: Driver;

  constructor() {
    this.driver = neo4j.driver(
      env.COGNODB_URI,
      neo4j.auth.basic(
        env.COGNODB_USERNAME,
        env.COGNODB_PASSWORD
      )
    );
  }

  getDriver(): Driver {
    return this.driver;
  }

  getSession(): Session {
    return this.driver.session();
  }

  async verifyConnection(): Promise<void> {
    try {
      await this.driver.verifyConnectivity();

      console.log("✅ CognoDB connection successful");
    } catch (error) {
      console.error("❌ CognoDB connection failed");
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.driver.close();
  }
}

export const database = new Database();