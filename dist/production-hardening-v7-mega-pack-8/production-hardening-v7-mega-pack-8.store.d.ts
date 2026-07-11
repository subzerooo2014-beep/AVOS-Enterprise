import { OnModuleInit } from "@nestjs/common";
import { ConfigurationEvidence, ConfigurationEvent, ConfigurationGovernanceState } from "./production-hardening-v7-mega-pack-8.types";
export declare class ProductionHardeningV7MegaPack8Store implements OnModuleInit {
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
    getSnapshot(): ConfigurationGovernanceState;
    mutate(mutator: (state: ConfigurationGovernanceState) => void | Promise<void>): Promise<ConfigurationGovernanceState>;
    appendEvent(event: Omit<ConfigurationEvent, "id" | "createdAt">): Promise<ConfigurationEvent>;
    appendEvidence(params: {
        evidenceType: string;
        entityType: string;
        entityId: string;
        payload: unknown;
    }): Promise<ConfigurationEvidence>;
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
