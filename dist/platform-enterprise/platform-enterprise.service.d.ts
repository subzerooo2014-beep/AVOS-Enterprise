import { PrismaService } from '../prisma/prisma.service';
export declare class PlatformEnterpriseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    health(): Promise<{
        status: string;
        timestamp: string;
        modules: {
            auth: boolean;
            users: boolean;
            crm: boolean;
            sales: boolean;
            inventory: boolean;
            finance: boolean;
            procurement: boolean;
            warehouse: boolean;
            platform: boolean;
        };
        counters: {
            users: number;
            organizations: number;
            branches: number;
            vehicles: number;
            customers: number;
            suppliers: number;
            invoices: number;
            warehouses: number;
            auditLogs: number;
        };
    }>;
    enterpriseSummary(): Promise<{
        name: string;
        mode: string;
        database: string;
        architecture: string;
        generatedAt: string;
    }>;
    createActivity(action: string, entity?: string, entityId?: string, userId?: string): Promise<{
        id: string;
        action: string;
        entity: string | null;
        entityId: string | null;
        userId: string | null;
        createdAt: Date;
    }>;
    recentActivity(): Promise<{
        id: string;
        action: string;
        entity: string | null;
        entityId: string | null;
        userId: string | null;
        createdAt: Date;
    }[]>;
    moduleRegistry(): Promise<{
        core: string[];
        business: string[];
        intelligence: string[];
        infrastructure: string[];
    }>;
}
