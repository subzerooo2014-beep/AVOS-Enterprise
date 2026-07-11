import { OnModuleInit } from "@nestjs/common";
import { ResilienceEvidence, ResilienceEvent, ResilienceState } from "./production-hardening-v7-mega-pack-7.types";
export declare class ProductionHardeningV7MegaPack7Store implements OnModuleInit {
    private readonly logger;
    private readonly storageDirectory;
    private readonly storageFile;
    private state;
    private writeQueue;
    private readonly readyPromise;
    private resolveReady;
    constructor();
    onModuleInit(): Promise<void>;
    waitUntilReady(): Promise<void>;
    getSnapshot(): ResilienceState;
    mutate(mutator: (state: ResilienceState) => void | Promise<void>): Promise<ResilienceState>;
    appendEvent(event: Omit<ResilienceEvent, "id" | "createdAt">): Promise<ResilienceEvent>;
    appendEvidence(params: {
        evidenceType: string;
        entityType: string;
        entityId: string;
        payload: unknown;
    }): Promise<ResilienceEvidence>;
    verifyEvidenceChain(): {
        verified: boolean;
        checked: number;
        brokenAt: string | null;
    };
    private load;
    private persist;
    private createInitialState;
    private normalizeState;
    private hash;
    private stableStringify;
}
