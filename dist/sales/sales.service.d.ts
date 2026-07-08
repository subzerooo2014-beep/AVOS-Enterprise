import { PrismaService } from "../prisma/prisma.service";
import { SaleStatus } from "./policies/sales.policy";
export declare class SalesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private saleDelegate;
    findAll(query?: any): Promise<{
        items: any;
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
    changeStatus(id: string, status: SaleStatus): Promise<any>;
    submit(id: string): Promise<any>;
    approve(id: string): Promise<any>;
    closeWon(id: string): Promise<any>;
    closeLost(id: string): Promise<any>;
    cancel(id: string): Promise<any>;
    close(id: string): Promise<any>;
    remove(id: string): Promise<any>;
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
}
