import { AvosBrainService } from "../../avos-brain/avos-brain.service";
export declare class EventDispatcherService {
    private readonly brain;
    constructor(brain: AvosBrainService);
    dispatch(event: any): Promise<{
        dispatched: boolean;
        eventId: any;
    }>;
}
