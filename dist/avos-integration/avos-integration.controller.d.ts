import { AvosIntegrationService } from "./avos-integration.service";
export declare class AvosIntegrationController {
    private service;
    constructor(service: AvosIntegrationService);
    vehicleCreated(body: any): Promise<any>;
    listRuns(): any;
}
