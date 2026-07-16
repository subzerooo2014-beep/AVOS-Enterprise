export class CreateG10ScenarioModelDto {
  id!: string;
  scenarioCode!: string;
  status!: string;
  confidence!: number;
  parameters?: Record<string, unknown>;
}

export class UpdateG10ScenarioModelDto {
  id?: string;
  scenarioCode?: string;
  status?: string;
  confidence?: number;
  parameters?: Record<string, unknown>;
}