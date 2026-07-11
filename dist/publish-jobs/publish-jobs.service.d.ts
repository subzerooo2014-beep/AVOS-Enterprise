import { PrismaService } from "../prisma/prisma.service";
import { PublisherDispatcherService } from "../publisher-engine/publisher-dispatcher.service";
import { PublisherRegistryService } from "../publisher-engine/publisher-registry.service";
export declare class PublishJobsService {
    private readonly prisma;
    private readonly dispatcher;
    private readonly registry;
    private readonly logger;
    constructor(prisma: PrismaService, dispatcher: PublisherDispatcherService, registry: PublisherRegistryService);
    create(vehicleId: string): Promise<any>;
    createChannelJob(vehicleId: string, channel: string, title: string, status?: string, content?: string, extra?: any): Promise<any>;
    forVehicle(vehicleId: string): Promise<any>;
    all(): Promise<any>;
    private findActiveDuplicate;
    private dispatchInBackground;
    private normalizeStatus;
    private normalizePriority;
    private normalizeMaxRetries;
    private requiredText;
    private errorMessage;
}
