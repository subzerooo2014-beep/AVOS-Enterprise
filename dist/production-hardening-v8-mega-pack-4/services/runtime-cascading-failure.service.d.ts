import { CascadingFailureAnalysis } from "../contracts";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeDependencyGraphService } from "./runtime-dependency-graph.service";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
export declare class RuntimeCascadingFailureService {
    private readonly store;
    private readonly graph;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, graph: RuntimeDependencyGraphService, audit: RuntimeGovernanceAuditService);
    analyze(sourceNodeId: string): CascadingFailureAnalysis;
    list(): CascadingFailureAnalysis[];
    private discoverPaths;
    private healthPenalty;
    private buildRecommendations;
}
