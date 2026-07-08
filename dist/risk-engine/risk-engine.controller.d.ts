import { RiskEngineService } from "./risk-engine.service";
export declare class RiskEngineController {
    private service;
    constructor(service: RiskEngineService);
    analyze(dto: any): {
        risk: string;
        fraudScore: number;
        recommendation: string;
    };
}
