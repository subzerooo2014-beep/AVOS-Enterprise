export class CreateDataQualityRuleDto {
  assetId!: string;
  name!: string;
  fieldName!: string;
  ruleType!:
    | "required"
    | "format"
    | "range"
    | "uniqueness"
    | "consistency";
  thresholdPercent?: number;
}
