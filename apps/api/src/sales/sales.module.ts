import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { EventsModule } from "../events/events.module";
import { WorkflowsModule } from "../workflows/workflows.module";
import { InventoryModule } from "../inventory/inventory.module";
import { SalesController } from "./sales.controller";
import { SalesService } from "./sales.service";

@Module({
  imports: [PrismaModule, InventoryModule, EventsModule, WorkflowsModule],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
