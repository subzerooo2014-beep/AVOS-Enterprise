import { TrustService } from "./trust.service";
export declare class TrustController {
    private service;
    constructor(service: TrustService);
    calculate(body: any): Promise<any>;
    list(): any;
}
