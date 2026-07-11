import { PlatformEnterpriseService } from './platform-enterprise.service';
export declare class PlatformEnterpriseController {
    private readonly service;
    constructor(service: PlatformEnterpriseService);
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
    summary(): Promise<{
        name: string;
        mode: string;
        database: string;
        architecture: string;
        generatedAt: string;
    }>;
    modules(): Promise<{
        core: string[];
        business: string[];
        intelligence: string[];
        infrastructure: string[];
    }>;
    recentActivity(): Promise<{
        id: string;
        action: string;
        createdAt: Date;
        entity: string | null;
        entityId: string | null;
        userId: string | null;
    }[]>;
    createActivity(action: string, entity?: string, entityId?: string, userId?: string): Promise<{
        id: string;
        action: string;
        createdAt: Date;
        entity: string | null;
        entityId: string | null;
        userId: string | null;
    }>;
}
