import { OnApplicationBootstrap } from "@nestjs/common";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
export declare class ProductionHardeningV8MegaPack4Bootstrap implements OnApplicationBootstrap {
    private readonly store;
    private readonly logger;
    constructor(store: RuntimeGovernanceStore);
    onApplicationBootstrap(): void;
}
