import { Module } from "@nestjs/common";
import { QuotesModule } from "../quotes/quotes.module";
import { OrdersModule } from "../orders/orders.module";
import { InvoicesModule } from "../invoices/invoices.module";
import { PaymentsModule } from "../payments/payments.module";
import { ReservationsModule } from "../reservations/reservations.module";
import { InventoryModule } from "../inventory/inventory.module";
import { SalesModule } from "../sales/sales.module";
import { EventsModule } from "../events/events.module";
import { WorkflowsModule } from "../workflows/workflows.module";
import { CoreApplicationFlowsController } from "./core-application-flows.controller";
import { CoreApplicationFlowsService } from "./core-application-flows.service";
import { CoreFlowRegistryService } from "./core-flow-registry.service";

@Module({
  imports: [
    QuotesModule,
    OrdersModule,
    InvoicesModule,
    PaymentsModule,
    ReservationsModule,
    InventoryModule,
    SalesModule,
    EventsModule,
    WorkflowsModule,
  ],
  controllers: [CoreApplicationFlowsController],
  providers: [CoreApplicationFlowsService, CoreFlowRegistryService],
  exports: [CoreApplicationFlowsService, CoreFlowRegistryService],
})
export class CoreApplicationFlowsModule {}
