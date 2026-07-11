import { CreateResilienceActionDto, ExecuteResilienceActionDto } from "../dto";
import { ResilienceActionService } from "../services/resilience-action.service";
export declare class ResilienceActionController {
    private readonly actions;
    constructor(actions: ResilienceActionService);
    create(dto: CreateResilienceActionDto): import("..").ResilienceAction;
    list(): import("..").ResilienceAction[];
    get(id: string): import("..").ResilienceAction;
    approve(id: string, dto: ExecuteResilienceActionDto): import("..").ResilienceAction;
    execute(id: string, dto: ExecuteResilienceActionDto): Promise<import("..").ResilienceAction>;
    cancel(id: string, dto: ExecuteResilienceActionDto): import("..").ResilienceAction;
}
