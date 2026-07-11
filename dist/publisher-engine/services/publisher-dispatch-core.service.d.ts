import { PrismaService } from "../../prisma/prisma.service";
import { PublisherRegistryService } from "../publisher-registry.service";
import { PublisherContextBuilderService } from "./publisher-context-builder.service";
import { PublisherResultNormalizerService } from "./publisher-result-normalizer.service";
export declare class PublisherDispatchCoreService {
    private readonly prisma;
    private readonly registry;
    private readonly contextBuilder;
    private readonly normalizer;
    constructor(prisma: PrismaService, registry: PublisherRegistryService, contextBuilder: PublisherContextBuilderService, normalizer: PublisherResultNormalizerService);
    dispatchOne(job: any): Promise<{
        success: boolean;
        status: "published" | "skipped";
        channel: string;
        jobId: any;
        result: import("../publisher-registry.service").PublisherResult;
        job: any;
        durationMs: number;
        completedAt: Date;
    }>;
    private validateReservedJob;
}
