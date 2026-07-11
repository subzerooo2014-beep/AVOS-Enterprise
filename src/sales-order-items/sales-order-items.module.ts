import { Module } from "@nestjs/common";
import { SalesOrderItemsController } from "./sales-order-items.controller";
import { SalesOrderItemsService } from "./sales-order-items.service";
import { SalesOrderItemsRepository } from "./sales-order-items.repository";
import { SalesOrderItemsMapper } from "./sales-order-items.mapper";

@Module({

 controllers:[
  SalesOrderItemsController
 ],

 providers:[
  SalesOrderItemsService,
  SalesOrderItemsRepository,
  SalesOrderItemsMapper
 ],

 exports:[
  SalesOrderItemsService
 ]

})
export class SalesOrderItemsModule {}
