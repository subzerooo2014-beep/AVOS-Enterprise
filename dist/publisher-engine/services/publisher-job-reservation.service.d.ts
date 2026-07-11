import { PrismaService } from "../../prisma/prisma.service";
export interface PublisherReservationOptions {
    workerId: string;
    limit: number;
    lockTimeoutMinutes?: number;
}
export interface PublisherReservationResult {
    success: boolean;
    workerId: string;
    requested: number;
    selected: number;
    reserved: number;
    jobs: any[];
    reservedAt: Date;
}
export declare class PublisherJobReservationService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    reserveBatch(options: PublisherReservationOptions): Promise<PublisherReservationResult>;
    reserveOne(jobId: string, workerId: string): Promise<any | null>;
    release(jobId: string, lockToken: string): Promise<boolean>;
    releaseExpired(timeoutMinutes?: number): Promise<number>;
    private normalizeLimit;
    private requireWorkerId;
    private requireText;
}
