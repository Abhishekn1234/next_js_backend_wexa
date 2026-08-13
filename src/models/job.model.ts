export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "REMOTE";
  minExperience: number;
  maxExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
  createdAt: string;
}