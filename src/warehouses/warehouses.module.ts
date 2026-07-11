import { Module } from "@nestjs/common";
import { WarehousesController } from "./warehouses.controller";
import { WarehousesService } from "./warehouses.service";
import { WarehousesRepository } from "./warehouses.repository";
import { WarehousesMapper } from "./warehouses.mapper";
import { WarehousesSerializer } from "./warehouses.serializer";
import { WarehousesPolicy } from "./warehouses.policy";

@Module({
 controllers:[WarehousesController],
 providers:[
  WarehousesService,
  WarehousesRepository,
  WarehousesMapper,
  WarehousesSerializer,
  WarehousesPolicy,
 ],
 exports:[WarehousesService],
})
export class WarehousesModule {}
