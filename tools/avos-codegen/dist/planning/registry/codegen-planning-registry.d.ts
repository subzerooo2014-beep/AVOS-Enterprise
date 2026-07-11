import { CodeGenPlanner } from "../contracts/codegen-planner.contracts";
export declare class CodeGenPlanningRegistry {
    private readonly planners;
    register(planner: CodeGenPlanner, replace?: boolean): CodeGenPlanner;
    get(key: string): CodeGenPlanner;
    list(): readonly CodeGenPlanner[];
    remove(key: string): CodeGenPlanner;
    clear(): void;
}
//# sourceMappingURL=codegen-planning-registry.d.ts.map