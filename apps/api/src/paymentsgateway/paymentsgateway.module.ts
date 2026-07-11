import { Module } from "@nestjs/common";
import { PaymentsgatewayController } from "./paymentsgateway.controller";
import { PaymentsgatewayService } from "./paymentsgateway.service";

@Module({
 controllers:[PaymentsgatewayController],
 providers:[PaymentsgatewayService],
})
export class PaymentsgatewayModule{}
