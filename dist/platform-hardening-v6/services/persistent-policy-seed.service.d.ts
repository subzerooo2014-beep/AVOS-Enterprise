import { OnModuleInit } from "@nestjs/common";
import { PolicyVersioningService } from "./policy-versioning.service";
export declare class PersistentPolicySeedService implements OnModuleInit {
    private readonly policies;
    constructor(policies: PolicyVersioningService);
    onModuleInit(): Promise<void>;
}
