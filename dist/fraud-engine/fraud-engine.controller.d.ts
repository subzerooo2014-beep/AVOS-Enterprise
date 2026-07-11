import { FraudEngineService } from "./fraud-engine.service";
export declare class FraudEngineController {
    private service;
    constructor(service: FraudEngineService);
    addSignal(body: any): Promise<any>;
    assess(body: any): Promise<any>;
    list(): any;
}
