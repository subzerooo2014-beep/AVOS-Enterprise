import { GrowthEngineService } from "./growth-engine.service";
export declare class GrowthEngineController {
    private service;
    constructor(service: GrowthEngineService);
    discover(body: any): Promise<any>;
    list(): any;
    mark(id: string, body: any): Promise<any>;
    selfMarketing(): Promise<any>;
}
