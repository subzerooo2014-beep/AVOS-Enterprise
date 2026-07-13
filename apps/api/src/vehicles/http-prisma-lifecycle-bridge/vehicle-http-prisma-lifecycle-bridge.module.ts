import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { VehicleLifecyclePrismaIntegrationModule } from "../lifecycle-prisma-integration/vehicle-lifecycle-prisma-integration.module";
import { VehicleHttpPrismaLifecycleInterceptor } from "./vehicle-http-prisma-lifecycle.interceptor";

@Module({
  imports: [VehicleLifecyclePrismaIntegrationModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: VehicleHttpPrismaLifecycleInterceptor,
    },
  ],
})
export class VehicleHttpPrismaLifecycleBridgeModule {}
