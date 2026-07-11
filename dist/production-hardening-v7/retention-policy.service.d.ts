import { AssuranceStorageService } from "./assurance-storage.service";
import { CreateRetentionPolicyDto } from "./dto/create-retention-policy.dto";
import { RetentionPolicy } from "./types/production-hardening-v7.types";
export declare class RetentionPolicyService {
    private readonly storage;
    private readonly collection;
    constructor(storage: AssuranceStorageService);
    create(dto: CreateRetentionPolicyDto): Promise<RetentionPolicy>;
    list(): Promise<RetentionPolicy[]>;
    seedDefaults(): Promise<{
        created: number;
        total: number;
    }>;
    private validateRetentionSequence;
}
