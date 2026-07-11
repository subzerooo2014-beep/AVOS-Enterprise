import { CreateIsolationPlanDto, UpdateIsolationPlanStatusDto } from "../dto";
import { RuntimeServiceIsolationService } from "../services";
export declare class RuntimeServiceIsolationController {
    private readonly isolation;
    constructor(isolation: RuntimeServiceIsolationService);
    create(dto: CreateIsolationPlanDto): import("..").ServiceIsolationPlan;
    list(): import("..").ServiceIsolationPlan[];
    get(id: string): import("..").ServiceIsolationPlan;
    updateStatus(id: string, dto: UpdateIsolationPlanStatusDto): import("..").ServiceIsolationPlan;
}
