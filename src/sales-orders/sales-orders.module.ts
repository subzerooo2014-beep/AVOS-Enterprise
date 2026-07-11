import { Module } from "@nestjs/common";
import { SalesOrdersController } from "./sales-orders.controller";
import { SalesOrdersService } from "./sales-orders.service";
import { SalesOrdersRepository } from "./sales-orders.repository";
import { SalesOrdersMapper } from "./sales-orders.mapper";
import { SalesOrdersSerializer } from "./sales-orders.serializer";
import { SalesOrdersPolicy } from "./sales-orders.policy";

@Module({

 controllers:[
  SalesOrdersController
 ],

 providers:[
  SalesOrdersService,
  SalesOrdersRepository,
  SalesOrdersMapper,
  SalesOrdersSerializer,
  SalesOrdersPolicy
 ],

 exports:[
  SalesOrdersService
 ]

})
export class SalesOrdersModule {}
