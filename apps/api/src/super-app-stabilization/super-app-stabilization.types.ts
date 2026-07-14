export interface StabilizationCheck {
  name: string;
  status: "PASS" | "FAIL";
  details: string;
}

export interface StabilizationReport {
  success: boolean;
  system: string;
  checks: StabilizationCheck[];
  score: number;
  generatedAt: string;
}
