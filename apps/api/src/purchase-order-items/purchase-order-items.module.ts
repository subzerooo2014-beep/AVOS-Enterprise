import { Module } from "@nestjs/common";
import { PurchaseOrderItemsController } from "./purchase-order-items.controller";
import { PurchaseOrderItemsService } from "./purchase-order-items.service";
import { PurchaseOrderItemsRepository } from "./purchase-order-items.repository";
import { PurchaseOrderItemsMapper } from "./purchase-order-items.mapper";

@Module({

 controllers:[
  PurchaseOrderItemsController
 ],

 providers:[
  PurchaseOrderItemsService,
  PurchaseOrderItemsRepository,
  PurchaseOrderItemsMapper
 ],

 exports:[
  PurchaseOrderItemsService
 ]

})
export class PurchaseOrderItemsModule {}
