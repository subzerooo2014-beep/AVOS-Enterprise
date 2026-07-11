import { SocialDeliveryWorkerService } from "./social-delivery-worker.service";
export declare class SocialDeliveryController {
    private readonly worker;
    constructor(worker: SocialDeliveryWorkerService);
    status(): any;
    credentials(): any;
    queue(limit?: string): Promise<any[]>;
    run(limit?: string): Promise<any>;
    requeue(channel?: string): Promise<any>;
    requeueAndRun(channel?: string, limit?: string): Promise<any>;
    processEvent(id: string): Promise<any>;
}
