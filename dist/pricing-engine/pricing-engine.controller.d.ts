import { PricingEngineService } from "./pricing-engine.service";
export declare class PricingEngineController {
    private readonly service;
    constructor(service: PricingEngineService);
    calculate(dto: any): number;
}
