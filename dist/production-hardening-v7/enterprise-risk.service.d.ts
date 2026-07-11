import { AssuranceStorageService } from "./assurance-storage.service";
import { CreateRiskDto } from "./dto/create-risk.dto";
import { EnterpriseRisk, RiskStatus } from "./types/production-hardening-v7.types";
export declare class EnterpriseRiskService {
    private readonly storage;
    private readonly collection;
    constructor(storage: AssuranceStorageService);
    create(dto: CreateRiskDto): Promise<EnterpriseRisk>;
    list(status?: RiskStatus): Promise<EnterpriseRisk[]>;
    get(id: string): Promise<EnterpriseRisk>;
    updateStatus(id: string, status: RiskStatus): Promise<EnterpriseRisk>;
    seedDefaults(): Promise<{
        created: number;
        total: number;
    }>;
    summary(): Promise<{
        total: number;
        open: number;
        critical: number;
        high: number;
        aggregateResidualScore: number;
        normalizedRiskScore: number;
    }>;
    private scoreToSeverity;
}
