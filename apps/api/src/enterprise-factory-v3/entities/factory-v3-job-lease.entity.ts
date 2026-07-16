export interface FactoryV3JobLease {
  id: string;
  jobId: string;
  workerId: string;
  expiresAt: string;
  active: boolean;
}