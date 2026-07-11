import { CommissionEngineService } from "./commission-engine.service";
export declare class CommissionEngineController {
    private service;
    constructor(service: CommissionEngineService);
    createPolicy(body: any): any;
    listPolicies(): any;
    calculate(body: any): Promise<any>;
    records(): any;
}
