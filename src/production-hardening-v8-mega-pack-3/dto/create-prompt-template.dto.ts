export class CreatePromptTemplateDto {
  name!: string;
  code!: string;
  description?: string;
  systemPrompt!: string;
  userPromptTemplate!: string;
  riskLevel?:
    | "low"
    | "medium"
    | "high"
    | "critical";
  allowedAgentCodes?: string[];
  requiredVariables?: string[];
  createdBy?: string;
}
