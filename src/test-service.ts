import { database } from "./config/database.js";
import { developerService } from "./services/developer.service.js";

import { recommendationService } from "./services/recommendation.service.js";



const testServices = async () => {
  try {
    console.log("\n👨‍💻 Developer:\n");

    const developer =
      await developerService.getDeveloperById("DEV001");

    console.log(developer);

    console.log("\n🛠️ Developer Skills:\n");

    const skills =
      await developerService.getDeveloperSkills("DEV001");

    console.log(skills);

    console.log("\n💼 Recommended Jobs:\n");

    const jobs =
      await recommendationService.getJobsForDeveloper(
        "DEV001"
      );

    console.dir(jobs, { depth: null });

    console.log("\n🔗 Related Skill Jobs:\n");

    const relatedJobs =
      await recommendationService.getRelatedSkillJobs(
        "DEV001"
      );

    console.dir(relatedJobs, { depth: null });

  } catch (error) {
    console.error("❌ Service test failed");
    console.error(error);
  } finally {
    await database.close();
  }
};

testServices();