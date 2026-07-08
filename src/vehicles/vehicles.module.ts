import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { VehiclesController } from "./vehicles.controller";
import { VehiclesService } from "./vehicles.service";
import { VehiclesRepository } from "./repositories/vehicles.repository";

@Module({
  imports: [PrismaModule],
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
