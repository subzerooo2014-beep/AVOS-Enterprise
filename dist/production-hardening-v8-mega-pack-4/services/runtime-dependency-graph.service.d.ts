import { RuntimeDependencyEdge, RuntimeDependencyNode } from "../contracts";
import { CreateDependencyEdgeDto, CreateDependencyNodeDto, UpdateDependencyHealthDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
export declare class RuntimeDependencyGraphService {
    private readonly store;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, audit: RuntimeGovernanceAuditService);
    createNode(dto: CreateDependencyNodeDto): RuntimeDependencyNode;
    createEdge(dto: CreateDependencyEdgeDto): RuntimeDependencyEdge;
    updateHealth(id: string, dto: UpdateDependencyHealthDto): RuntimeDependencyNode;
    listNodes(): RuntimeDependencyNode[];
    listEdges(): RuntimeDependencyEdge[];
    getNode(id: string): RuntimeDependencyNode;
    getEdge(id: string): RuntimeDependencyEdge;
    getOutgoingEdges(nodeId: string): RuntimeDependencyEdge[];
    getIncomingEdges(nodeId: string): RuntimeDependencyEdge[];
    getGraphSnapshot(environment?: string, namespace?: string): {
        nodes: RuntimeDependencyNode[];
        edges: RuntimeDependencyEdge[];
        healthyNodes: number;
        degradedNodes: number;
        unhealthyNodes: number;
        unavailableNodes: number;
        unknownNodes: number;
        generatedAt: string;
    };
    private wouldCreateCycle;
}
