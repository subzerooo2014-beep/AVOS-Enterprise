import { PublishPlatformEventDto } from "./dto/publish-platform-event.dto";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEvent } from "./types/mega-pack-6.types";
export declare class PlatformEventBusService {
    private readonly storage;
    private readonly sequence;
    constructor(storage: MegaPack6StorageService, sequence: EnterpriseSequenceService);
    publish(dto: PublishPlatformEventDto): Promise<PlatformEvent>;
    list(status?: PlatformEvent["processingStatus"], eventType?: string): Promise<PlatformEvent[]>;
    markProcessing(id: string): Promise<PlatformEvent>;
    markProcessed(id: string): Promise<PlatformEvent>;
    markFailed(id: string, errorMessage: string): Promise<PlatformEvent>;
    pendingCount(): Promise<number>;
    private updateStatus;
}
