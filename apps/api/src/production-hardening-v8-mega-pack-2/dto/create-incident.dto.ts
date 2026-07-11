export class CreateIncidentDto {
  title!: string;
  priority!:
    | "low"
    | "medium"
    | "high"
    | "critical";
  description?: string;
}
