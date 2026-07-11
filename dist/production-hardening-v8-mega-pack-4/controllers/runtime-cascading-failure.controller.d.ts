import { RuntimeCascadingFailureService } from "../services";
export declare class RuntimeCascadingFailureController {
    private readonly cascade;
    constructor(cascade: RuntimeCascadingFailureService);
    analyze(sourceNodeId: string): import("..").CascadingFailureAnalysis;
    list(): import("..").CascadingFailureAnalysis[];
}
