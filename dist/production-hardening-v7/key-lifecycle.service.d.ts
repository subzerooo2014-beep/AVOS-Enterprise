import { AssuranceStorageService } from "./assurance-storage.service";
import { CreateKeyRecordDto } from "./dto/create-key-record.dto";
import { CryptographicKeyRecord, KeyLifecycleStatus } from "./types/production-hardening-v7.types";
export declare class KeyLifecycleService {
    private readonly storage;
    private readonly collection;
    constructor(storage: AssuranceStorageService);
    register(dto: CreateKeyRecordDto): Promise<CryptographicKeyRecord>;
    list(): Promise<CryptographicKeyRecord[]>;
    updateStatus(id: string, status: KeyLifecycleStatus): Promise<CryptographicKeyRecord>;
    evaluateRotationDue(): Promise<{
        evaluated: number;
        rotationDue: number;
        records: CryptographicKeyRecord[];
    }>;
    seedDefaults(): Promise<{
        created: number;
        total: number;
    }>;
    private createMetadataFingerprint;
}
