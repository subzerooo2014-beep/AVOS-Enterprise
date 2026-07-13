import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { VehicleLifecycleIntegrationModule } from "../lifecycle-integration/vehicle-lifecycle-integration.module";
import { VehicleHttpLifecycleInterceptor } from "./vehicle-http-lifecycle.interceptor";

@Module({
  imports: [VehicleLifecycleIntegrationModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: VehicleHttpLifecycleInterceptor,
    },
  ],
})
export class VehicleHttpLifecycleBridgeModule {}
