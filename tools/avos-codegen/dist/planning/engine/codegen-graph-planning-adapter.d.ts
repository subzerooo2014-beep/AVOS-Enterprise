import { CodeGenPlanningContext, CodeGenPlanningResult } from "../contracts/codegen-planning.contracts";
import { CodeGenDependencyGraphAnalyzer } from "../analysis/codegen-dependency-graph-analyzer";
import { CodeGenExecutionPlanBuilder } from "../builders/codegen-execution-plan-builder";
export declare class CodeGenGraphPlanningAdapter {
    readonly analyzer: CodeGenDependencyGraphAnalyzer;
    readonly builder: CodeGenExecutionPlanBuilder;
    constructor(analyzer?: CodeGenDependencyGraphAnalyzer, builder?: CodeGenExecutionPlanBuilder);
    execute(context: CodeGenPlanningContext): CodeGenPlanningResult;
}
//# sourceMappingURL=codegen-graph-planning-adapter.d.ts.map