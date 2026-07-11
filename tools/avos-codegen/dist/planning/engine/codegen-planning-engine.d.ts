import { CodeGenPlanningContext, CodeGenPlanningResult } from "../contracts/codegen-planning.contracts";
import { CodeGenPlanningRegistry } from "../registry/codegen-planning-registry";
export declare class CodeGenPlanningEngine {
    readonly registry: CodeGenPlanningRegistry;
    constructor(registry?: CodeGenPlanningRegistry);
    execute(plannerKey: string, context: CodeGenPlanningContext): Promise<CodeGenPlanningResult>;
    executeDefault(context: CodeGenPlanningContext): Promise<CodeGenPlanningResult>;
}
//# sourceMappingURL=codegen-planning-engine.d.ts.map