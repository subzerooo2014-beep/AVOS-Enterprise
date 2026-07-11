import { PublishJobsService } from "./publish-jobs.service";
export declare class PublishJobsController {
    private readonly service;
    constructor(service: PublishJobsService);
    all(): Promise<any>;
    forVehicle(vehicleId: string): Promise<any>;
    test(vehicleId: string): Promise<any>;
}
