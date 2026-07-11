import { CodeGenJsonValue, CodeGenMetadata } from "../../core/codegen.contracts";
export declare enum CodeGenGenerationJournalLevel {
    DEBUG = "debug",
    INFORMATIONAL = "informational",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical"
}
export interface CodeGenGenerationJournalEntry {
    id: string;
    sequence: number;
    sessionId: string;
    level: CodeGenGenerationJournalLevel;
    code: string;
    message: string;
    artifactKey?: string;
    details: CodeGenMetadata;
    createdAt: string;
}
export declare class CodeGenGenerationJournal {
    private readonly entries;
    private sequence;
    write(input: {
        sessionId: string;
        level: CodeGenGenerationJournalLevel;
        code: string;
        message: string;
        artifactKey?: string;
        details?: Record<string, CodeGenJsonValue>;
    }): CodeGenGenerationJournalEntry;
    list(sessionId?: string): CodeGenGenerationJournalEntry[];
    clear(): void;
}
//# sourceMappingURL=codegen-generation-journal.d.ts.map