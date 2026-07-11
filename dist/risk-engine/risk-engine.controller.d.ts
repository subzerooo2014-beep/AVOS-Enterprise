import { RiskEngineService } from "./risk-engine.service";
export declare class RiskEngineController {
    private service;
    constructor(service: RiskEngineService);
    assess(body: any): Promise<any>;
    list(): any;
}
