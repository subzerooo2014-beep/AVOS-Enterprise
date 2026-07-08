import { PrismaService } from "../prisma/prisma.service";
import { InventoryInsightDto } from "./dto/inventory-insight.dto";
export declare class InventoryIntelligenceService {
    private prisma;
    constructor(prisma: PrismaService);
    overview(dto: InventoryInsightDto): Promise<{
        total: any;
        available: any;
        reserved: any;
        sold: any;
        totalValue: any;
        averagePrice: number;
        items: any;
    }>;
    slowMoving(): Promise<any>;
}
