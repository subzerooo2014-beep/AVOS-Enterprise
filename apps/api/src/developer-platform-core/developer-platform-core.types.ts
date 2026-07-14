export type SdkStatus = "DRAFT" | "GENERATED" | "PUBLISHED" | "DEPRECATED";

export interface SdkPackageRecord {
  id: string;
  name: string;
  language: string;
  version: string;
  status: SdkStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DeveloperSandboxRecord {
  id: string;
  name: string;
  ownerId: string;
  expiresAt: string;
  status: "ACTIVE" | "EXPIRED" | "SUSPENDED";
}
