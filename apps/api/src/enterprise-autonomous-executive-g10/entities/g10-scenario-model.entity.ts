export interface G10ScenarioModel {
  id: string;
  scenarioCode: string;
  status: string;
  confidence: number;
  parameters?: Record<string, unknown>;
}