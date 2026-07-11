import { CreateDependencyEdgeDto, CreateDependencyNodeDto, UpdateDependencyHealthDto } from "../dto";
import { RuntimeDependencyGraphService } from "../services";
export declare class RuntimeDependencyGraphController {
    private readonly graph;
    constructor(graph: RuntimeDependencyGraphService);
    createNode(dto: CreateDependencyNodeDto): import("..").RuntimeDependencyNode;
    createEdge(dto: CreateDependencyEdgeDto): import("..").RuntimeDependencyEdge;
    updateHealth(id: string, dto: UpdateDependencyHealthDto): import("..").RuntimeDependencyNode;
    listNodes(): import("..").RuntimeDependencyNode[];
    listEdges(): import("..").RuntimeDependencyEdge[];
    getNode(id: string): import("..").RuntimeDependencyNode;
    getEdge(id: string): import("..").RuntimeDependencyEdge;
    snapshot(environment?: string, namespace?: string): {
        nodes: import("..").RuntimeDependencyNode[];
        edges: import("..").RuntimeDependencyEdge[];
        healthyNodes: number;
        degradedNodes: number;
        unhealthyNodes: number;
        unavailableNodes: number;
        unknownNodes: number;
        generatedAt: string;
    };
}
