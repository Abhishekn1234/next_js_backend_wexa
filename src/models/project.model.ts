export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "COMPLETED" | "ONGOING" | "PLANNED";
  startDate?: string;
  endDate?: string;
}