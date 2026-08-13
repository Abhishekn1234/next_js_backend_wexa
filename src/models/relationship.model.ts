export interface HasSkillRelationship {
  type: "HAS_SKILL";
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  yearsOfExperience?: number;
}

export interface WorkedOnRelationship {
  type: "WORKED_ON";
  role?: string;
  startDate?: string;
  endDate?: string;
}

export interface WorkedAtRelationship {
  type: "WORKED_AT";
  role?: string;
  startDate?: string;
  endDate?: string;
}

export interface UsesSkillRelationship {
  type: "USES_SKILL";
}

export interface PostedRelationship {
  type: "POSTED";
  postedAt: string;
}

export interface RequiresRelationship {
  type: "REQUIRES";
  importance?: "REQUIRED" | "PREFERRED";
}

export interface RelatedToRelationship {
  type: "RELATED_TO";
  strength?: number;
}