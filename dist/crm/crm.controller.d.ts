import { CrmService } from "./crm.service";
import { CreateCrmDto } from "./dto/create-crm.dto";
import { UpdateCrmDto } from "./dto/update-crm.dto";
import { BulkCrmDto } from "./dto/bulk-crm.dto";
import { CrmActivityDto } from "./dto/crm-activity.dto";
import { CrmFollowUpDto } from "./dto/crm-followup.dto";
import { CrmConvertSaleDto } from "./dto/crm-convert-sale.dto";
import { CrmMergeDto } from "./dto/crm-merge.dto";
import { CrmNoteDto } from "./dto/crm-note.dto";
export declare class CrmController {
    private readonly service;
    constructor(service: CrmService);
    findAll(query: any): Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
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
    exportRows(query: any): Promise<any[]>;
    importRows(rows: any[]): Promise<{
        imported: number;
        items: any[];
    }>;
    bulkStatus(dto: BulkCrmDto): Promise<{
        updated: any;
        status: any;
    }>;
    bulkAssign(dto: BulkCrmDto): Promise<{
        updated: any;
        assignedToId: any;
    }>;
    merge(dto: CrmMergeDto): Promise<any>;
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
    findOne(id: string): Promise<any>;
    create(dto: CreateCrmDto): Promise<any>;
    update(id: string, dto: UpdateCrmDto): Promise<any>;
    changeStatus(id: string, status: string): Promise<any>;
    assign(id: string, assignedToId: string): Promise<any>;
    scheduleFollowUp(id: string, dto: CrmFollowUpDto): Promise<any>;
    addActivity(id: string, dto: CrmActivityDto): Promise<any>;
    addNote(id: string, dto: CrmNoteDto): Promise<any>;
    convertToSale(id: string, dto: CrmConvertSaleDto): Promise<{
        crm: string;
        sale: any;
    }>;
    remove(id: string): Promise<any>;
}
