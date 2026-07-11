import { DependencyRelationshipType } from "../contracts";
export declare class CreateDependencyEdgeDto {
    sourceNodeId: string;
    targetNodeId: string;
    relationshipType: DependencyRelationshipType;
    criticality: number;
    timeoutMilliseconds?: number;
    retryEnabled: boolean;
    fallbackNodeId?: string;
    metadata?: Record<string, unknown>;
}
