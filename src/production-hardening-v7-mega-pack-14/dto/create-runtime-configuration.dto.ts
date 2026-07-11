export class CreateRuntimeConfigurationDto {
  name!: string;
  environment!:
    | "development"
    | "testing"
    | "staging"
    | "production";
  values!: Record<string, unknown>;
  createdBy?: string;
}
