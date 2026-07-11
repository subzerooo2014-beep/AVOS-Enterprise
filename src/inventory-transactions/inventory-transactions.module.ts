import { Module } from "@nestjs/common";
import { InventoryTransactionsController } from "./inventory-transactions.controller";
import { InventoryTransactionsService } from "./inventory-transactions.service";
import { InventoryTransactionsRepository } from "./inventory-transactions.repository";
import { InventoryTransactionsMapper } from "./inventory-transactions.mapper";
import { InventoryTransactionsSerializer } from "./inventory-transactions.serializer";
import { InventoryTransactionsPolicy } from "./inventory-transactions.policy";

@Module({

  controllers:[
    InventoryTransactionsController
  ],

  providers:[
    InventoryTransactionsService,
    InventoryTransactionsRepository,
    InventoryTransactionsMapper,
    InventoryTransactionsSerializer,
    InventoryTransactionsPolicy
  ],

  exports:[
    InventoryTransactionsService
  ]

})
export class InventoryTransactionsModule {}
