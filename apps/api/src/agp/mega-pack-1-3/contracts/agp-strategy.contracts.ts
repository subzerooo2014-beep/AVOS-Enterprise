import { AgpApprovalStatus } from "./agp-runtime.contracts";

export interface AgpKpi {
  id: string;
  name: string;
  unit: string;
  baseline: number;
  target: number;
  current: number;
  weight: number;
}

export interface AgpObjective {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: AgpApprovalStatus;
  keyResults: AgpKpi[];
}

export interface AgpStrategy {
  id: string;
  name: string;
  vision: string;
  theme: string;
  owner: string;
  objectives: AgpObjective[];
  dependencies: string[];
  version: number;
  status: AgpApprovalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AgpPlan {
  id: string;
  strategyId: string;
  horizon: "annual" | "quarterly" | "monthly";
  scenario: string;
  milestones: string[];
  resources: Record<string, number>;
  dependencies: string[];
  status: AgpApprovalStatus;
  createdAt: string;
}