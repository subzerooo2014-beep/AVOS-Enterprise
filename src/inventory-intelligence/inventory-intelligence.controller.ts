import { Controller, Get, Query } from "@nestjs/common";
import { InventoryIntelligenceService } from "./inventory-intelligence.service";
import { InventoryInsightDto } from "./dto/inventory-insight.dto";

@Controller("inventory-intelligence")
export class InventoryIntelligenceController {
  constructor(private service: InventoryIntelligenceService) {}

  @Get("overview")
  overview(@Query() dto: InventoryInsightDto) {
    return this.service.overview(dto);
  }

  @Get("slow-moving")
  slowMoving() {
    return this.service.slowMoving();
  }
}
