import { AiActionLogService } from "./ai-action-log.service";
export declare class AiActionLogController {
    private readonly service;
    constructor(service: AiActionLogService);
    history(id: string): Promise<any>;
}
