import { PublishPlatformEventDto } from "./dto/publish-platform-event.dto";
import { PlatformEventBusService } from "./platform-event-bus.service";
import { PlatformEvent } from "./types/mega-pack-6.types";
export declare class PlatformEventController {
    private readonly events;
    constructor(events: PlatformEventBusService);
    publish(dto: PublishPlatformEventDto): Promise<PlatformEvent>;
    list(status?: PlatformEvent["processingStatus"], eventType?: string): Promise<PlatformEvent[]>;
    markProcessing(id: string): Promise<PlatformEvent>;
    markProcessed(id: string): Promise<PlatformEvent>;
    markFailed(id: string, body: {
        errorMessage: string;
    }): Promise<PlatformEvent>;
}
