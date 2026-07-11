import { AvosBrainService } from "./avos-brain.service";
export declare class AvosBrainController {
    private service;
    constructor(service: AvosBrainService);
    processEvent(eventId: string): Promise<{
        processed: number;
        results: any[];
    }>;
    processLatest(body: any): Promise<{
        processed: number;
        results: any[];
    }>;
    listTasks(status?: string): any;
    complete(id: string, body: any): Promise<any>;
}
