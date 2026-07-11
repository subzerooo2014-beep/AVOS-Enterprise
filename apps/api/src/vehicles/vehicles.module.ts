import { AvosOsKernelModule } from "../avos-os-kernel/avos-os-kernel.module";
import { EventBusModule } from "../event-bus/event-bus.module";
import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { VehiclesController } from "./vehicles.controller";
import { VehiclesService } from "./vehicles.service";
import { VehiclesRepository } from "./repositories/vehicles.repository";

@Module({
  imports: [AvosOsKernelModule, EventBusModule, PrismaModule],
  controllers: [VehiclesController],
  providers: [
    VehiclesRepository,
    VehiclesService,
  ],
  exports: [
    VehiclesRepository,
    VehiclesService,
  ],
})
export class VehiclesModule {}


