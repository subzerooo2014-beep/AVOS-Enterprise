import { ComplianceBaselineService } from "./compliance-baseline.service";
import { ActorDto } from "./dto/actor.dto";
import { CompareBaselineDto } from "./dto/compare-baseline.dto";
import { CreateComplianceBaselineDto } from "./dto/create-compliance-baseline.dto";
import { UpdateBaselineStatusDto } from "./dto/update-baseline-status.dto";
import { BaselineStatus } from "./types/mega-pack-6.types";
export declare class ComplianceBaselineController {
    private readonly baselines;
    constructor(baselines: ComplianceBaselineService);
    create(dto: CreateComplianceBaselineDto): Promise<import("./types/mega-pack-6.types").ComplianceBaseline>;
    list(status?: BaselineStatus): Promise<import("./types/mega-pack-6.types").ComplianceBaseline[]>;
    listComparisons(baselineId?: string): Promise<import("./types/mega-pack-6.types").BaselineComparison[]>;
    get(id: string): Promise<import("./types/mega-pack-6.types").ComplianceBaseline>;
    updateStatus(id: string, dto: UpdateBaselineStatusDto & ActorDto): Promise<import("./types/mega-pack-6.types").ComplianceBaseline>;
    compare(id: string, dto: CompareBaselineDto): Promise<import("./types/mega-pack-6.types").BaselineComparison>;
}
