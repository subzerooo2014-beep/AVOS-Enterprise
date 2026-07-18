export class GenesisHumanDecisionDto {
  decision!: "approve" | "reject";
  decidedBy!: string;
  reason!: string;
}
