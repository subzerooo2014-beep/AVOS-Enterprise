import { TaxEngineService } from "./tax-engine.service";
export declare class TaxEngineController {
    private readonly service;
    constructor(service: TaxEngineService);
    calculate(dto: any): number;
}
