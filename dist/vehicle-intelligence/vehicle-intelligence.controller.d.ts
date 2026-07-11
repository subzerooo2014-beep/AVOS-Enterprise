import { VehicleIntelligenceService } from "./vehicle-intelligence.service";
export declare class VehicleIntelligenceController {
    private service;
    constructor(service: VehicleIntelligenceService);
    valueVehicle(body: any): Promise<any>;
    list(): any;
}
