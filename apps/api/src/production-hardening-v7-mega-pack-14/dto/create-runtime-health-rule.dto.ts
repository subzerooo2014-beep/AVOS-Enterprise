export class CreateRuntimeHealthRuleDto {
  name!: string;
  environment!:
    | "development"
    | "testing"
    | "staging"
    | "production";
  metricName!: string;
  operator!: "gte" | "lte" | "gt" | "lt" | "eq";
  threshold!: number;
}
