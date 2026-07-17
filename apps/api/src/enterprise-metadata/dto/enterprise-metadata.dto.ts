import { DependencyType, MetadataAssetType, MetadataStatus } from "../contracts/enterprise-metadata.contracts";

export interface RegisterMetadataDto {
  readonly key: string;
  readonly assetType: MetadataAssetType;
  readonly name: string;
  readonly description?: string;
  readonly version?: string;
  readonly status?: MetadataStatus;
  readonly owner?: string;
  readonly tags?: readonly string[];
  readonly attributes?: Readonly<Record<string, unknown>>;
  readonly lineage?: readonly string[];
}

export interface UpdateMetadataDto {
  readonly name?: string;
  readonly description?: string;
  readonly version?: string;
  readonly status?: MetadataStatus;
  readonly owner?: string;
  readonly tags?: readonly string[];
  readonly attributes?: Readonly<Record<string, unknown>>;
  readonly lineage?: readonly string[];
}

export interface LinkDependencyDto {
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: DependencyType;
  readonly criticality?: "low" | "medium" | "high" | "critical";
  readonly metadata?: Readonly<Record<string, unknown>>;
}
