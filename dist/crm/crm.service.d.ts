import { PrismaService } from "../prisma/prisma.service";
export declare class CrmService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private delegate;
    private optionalDelegate;
    findAll(query?: any): Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
    update(id: string, dto: any): Promise<any>;
    dashboard(): Promise<{
        total: any;
        newCount: any;
        contacted: any;
        qualified: any;
        opportunity: any;
        won: any;
        lost: any;
        inactive: any;
        active: any;
        winRate: number;
        lossRate: number;
        conversionRate: number;
        pipelineValue: number;
        weightedPipelineValue: number;
        overdueFollowUps: any;
        pipelineHealth: {
            active: any;
            final: any;
            opportunityRatio: number;
        };
    }>;
    pipeline(): Promise<Record<string, any[]>>;
    segments(): Promise<Record<string, any[]>>;
    duplicates(): Promise<{
        key: string;
        count: number;
        items: any[];
    }[]>;
    dataQuality(): Promise<{
        average: number;
        total: any;
        items: any;
    }>;
    automationQueue(): Promise<any[]>;
    forecast(): Promise<{
        rawPipelineValue: number;
        weightedPipelineValue: number;
        records: any;
        generatedAt: string;
    }>;
    overdueFollowUps(): Promise<any[]>;
    changeStatus(id: string, status: string): Promise<any>;
    assign(id: string, assignedToId: string): Promise<any>;
    scheduleFollowUp(id: string, nextFollowUpAt: string): Promise<any>;
    addNote(id: string, note: string): Promise<any>;
    addActivity(id: string, dto: any): Promise<any>;
    customer360(id: string): Promise<{
        profile: any;
        sales: any[];
        vehicles: any[];
        tasks: any[];
        summary: {
            salesCount: number;
            vehiclesCount: number;
            tasksCount: number;
            totalSalesValue: any;
        };
    }>;
    exportRows(query?: any): Promise<any[]>;
    importRows(rows: any[]): Promise<{
        imported: number;
        items: any[];
    }>;
    bulkStatus(dto: any): Promise<{
        updated: any;
        status: any;
    }>;
    bulkAssign(dto: any): Promise<{
        updated: any;
        assignedToId: any;
    }>;
    merge(dto: any): Promise<any>;
    convertToSale(id: string, dto?: any): Promise<{
        crm: string;
        sale: any;
    }>;
    remove(id: string): Promise<any>;
}
