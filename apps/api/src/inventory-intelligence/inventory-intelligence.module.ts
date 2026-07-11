import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { InventoryIntelligenceController } from "./inventory-intelligence.controller";
import { InventoryIntelligenceService } from "./inventory-intelligence.service";

@Module({
  imports: [PrismaModule],
  controllers: [InventoryIntelligenceController],
  providers: [InventoryIntelligenceService],
})
export class InventoryIntelligenceModule {}
