export class DetectConfigurationDriftDto {
  configurationId!: string;
  actualValues!: Record<string, unknown>;
  description?: string;
}
