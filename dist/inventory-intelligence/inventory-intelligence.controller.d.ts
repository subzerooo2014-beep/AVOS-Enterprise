import { InventoryIntelligenceService } from "./inventory-intelligence.service";
import { InventoryInsightDto } from "./dto/inventory-insight.dto";
export declare class InventoryIntelligenceController {
    private service;
    constructor(service: InventoryIntelligenceService);
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
