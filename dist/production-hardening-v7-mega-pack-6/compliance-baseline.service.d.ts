import { CompareBaselineDto } from "./dto/compare-baseline.dto";
import { CreateComplianceBaselineDto } from "./dto/create-compliance-baseline.dto";
import { EnterpriseFingerprintService } from "./enterprise-fingerprint.service";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { ObjectPathService } from "./object-path.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import { BaselineComparison, BaselineStatus, ComplianceBaseline } from "./types/mega-pack-6.types";
export declare class ComplianceBaselineService {
    private readonly storage;
    private readonly sequence;
    private readonly fingerprint;
    private readonly objectPath;
    private readonly events;
    constructor(storage: MegaPack6StorageService, sequence: EnterpriseSequenceService, fingerprint: EnterpriseFingerprintService, objectPath: ObjectPathService, events: PlatformEventBusService);
    create(dto: CreateComplianceBaselineDto): Promise<ComplianceBaseline>;
    list(status?: BaselineStatus): Promise<ComplianceBaseline[]>;
    get(id: string): Promise<ComplianceBaseline>;
    updateStatus(id: string, status: BaselineStatus, actor?: string): Promise<ComplianceBaseline>;
    compare(baselineId: string, dto: CompareBaselineDto): Promise<BaselineComparison>;
    listComparisons(baselineId?: string): Promise<BaselineComparison[]>;
    seedDefaults(): Promise<{
        created: number;
        total: number;
    }>;
    private evaluateControl;
    private validateStatusTransition;
    private supersedePrevious;
    private resolveDriftSeverity;
}
