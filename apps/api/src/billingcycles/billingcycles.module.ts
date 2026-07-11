import { Module } from "@nestjs/common";
import { BillingcyclesController } from "./billingcycles.controller";
import { BillingcyclesService } from "./billingcycles.service";

@Module({
 controllers:[BillingcyclesController],
 providers:[BillingcyclesService],
})
export class BillingcyclesModule{}
