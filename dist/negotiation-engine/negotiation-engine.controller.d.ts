import { NegotiationEngineService } from "./negotiation-engine.service";
export declare class NegotiationEngineController {
    private service;
    constructor(service: NegotiationEngineService);
    create(body: any): any;
    counter(id: string, body: any): Promise<any>;
    list(): any;
}
