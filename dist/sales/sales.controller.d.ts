import { SalesService } from "./sales.service";
export declare class SalesController {
    private readonly service;
    constructor(service: SalesService);
    findAll(query: any): Promise<{
        items: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    dashboard(): Promise<{
        totalSales: any;
        openSales: any;
        draftSales: any;
        pendingSales: any;
        approvedSales: any;
        wonSales: any;
        lostSales: any;
        cancelledSales: any;
        closedSales: any;
        activeSales: any;
        winRate: number;
    }>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
    update(id: string, dto: any): Promise<any>;
    submit(id: string): Promise<any>;
    approve(id: string): Promise<any>;
    won(id: string): Promise<any>;
    lost(id: string): Promise<any>;
    cancel(id: string): Promise<any>;
    close(id: string): Promise<any>;
    remove(id: string): Promise<any>;
}
