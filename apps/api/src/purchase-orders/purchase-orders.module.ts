import { Module } from "@nestjs/common";
import { PurchaseOrdersController } from "./purchase-orders.controller";
import { PurchaseOrdersService } from "./purchase-orders.service";
import { PurchaseOrdersRepository } from "./purchase-orders.repository";
import { PurchaseOrdersMapper } from "./purchase-orders.mapper";
import { PurchaseOrdersSerializer } from "./purchase-orders.serializer";
import { PurchaseOrdersPolicy } from "./purchase-orders.policy";

@Module({

 controllers:[
  PurchaseOrdersController
 ],

 providers:[
  PurchaseOrdersService,
  PurchaseOrdersRepository,
  PurchaseOrdersMapper,
  PurchaseOrdersSerializer,
  PurchaseOrdersPolicy
 ],

 exports:[
  PurchaseOrdersService
 ]

})
export class PurchaseOrdersModule {}
