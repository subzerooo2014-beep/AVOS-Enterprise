import { AiResultsService } from "./ai-results.service";
export declare class AiResultsController {
    private readonly service;
    constructor(service: AiResultsService);
    getVehicleResults(id: string): Promise<any>;
}
