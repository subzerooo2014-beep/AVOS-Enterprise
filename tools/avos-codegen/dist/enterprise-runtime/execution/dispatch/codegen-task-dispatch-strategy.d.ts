import { CodeGenExecutionTask } from "../contracts/codegen-execution-task.contracts";
export interface CodeGenTaskDispatchStrategy {
    sort(tasks: readonly CodeGenExecutionTask[]): CodeGenExecutionTask[];
}
export declare class CodeGenPriorityWeightDispatchStrategy implements CodeGenTaskDispatchStrategy {
    sort(tasks: readonly CodeGenExecutionTask[]): CodeGenExecutionTask[];
}
//# sourceMappingURL=codegen-task-dispatch-strategy.d.ts.map