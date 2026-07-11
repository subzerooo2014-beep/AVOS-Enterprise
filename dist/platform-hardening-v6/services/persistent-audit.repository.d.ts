import { PrismaService } from "../../prisma/prisma.service";
export declare class PersistentAuditRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get model(): any;
    findLatest(): any;
    findFirst(): any;
    findById(id: string): any;
    findBySequence(sequence: number): any;
    findMany(input: {
        limit: number;
        eventType?: string;
        severity?: string;
        actor?: string;
        correlationId?: string;
    }): any;
    findAllAscending(): any;
    count(): any;
    create(data: Record<string, unknown>): any;
    getSeverityCounts(): any;
    getTypeCounts(): any;
}
