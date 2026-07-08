import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { VehicleSearchController } from "./vehicle-search.controller";
import { VehicleSearchService } from "./vehicle-search.service";

@Module({
  imports: [PrismaModule],
  controllers: [VehicleSearchController],
  providers: [VehicleSearchService],
})
export class VehicleSearchModule {}
