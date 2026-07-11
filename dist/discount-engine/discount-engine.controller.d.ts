import { DiscountEngineService } from "./discount-engine.service";
export declare class DiscountEngineController {
    private readonly service;
    constructor(service: DiscountEngineService);
    apply(dto: any): number;
}
