import { DependencyHealthStatus, DependencyNodeType, GovernanceEnvironment } from "../contracts";
export declare class CreateDependencyNodeDto {
    key: string;
    name: string;
    type: DependencyNodeType;
    environment: GovernanceEnvironment;
    namespace: string;
    service?: string;
    criticality: number;
    healthStatus?: DependencyHealthStatus;
    healthScore?: number;
    region?: string;
    zone?: string;
    owner?: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
}
