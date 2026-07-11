import { CodeGenGenerationTransactionSnapshot, CodeGenTransactionOperation } from "../codegen-generation.contracts";
export declare class CodeGenGenerationTransaction {
    readonly sessionId: string;
    readonly id: `${string}-${string}-${string}-${string}-${string}`;
    private readonly operations;
    private committed;
    private committedAt;
    readonly createdAt: string;
    constructor(sessionId: string);
    stageWrite(input: {
        artifactKey: string;
        absolutePath: string;
        content: string;
    }): Promise<CodeGenTransactionOperation>;
    execute(): Promise<CodeGenTransactionOperation[]>;
    commit(): void;
    rollback(): Promise<CodeGenTransactionOperation[]>;
    list(): CodeGenTransactionOperation[];
    snapshot(): CodeGenGenerationTransactionSnapshot;
    private hash;
}
//# sourceMappingURL=codegen-generation-transaction.d.ts.map