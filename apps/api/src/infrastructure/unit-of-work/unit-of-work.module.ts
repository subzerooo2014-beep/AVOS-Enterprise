import { Module } from "@nestjs/common";
import { TransactionManagerService } from "../transactions/transaction-manager.service";
import { UnitOfWorkContext } from "./unit-of-work.context";
import { UnitOfWorkController } from "./unit-of-work.controller";
import { UnitOfWorkRegistry } from "./unit-of-work.registry";
import { UnitOfWorkService } from "./unit-of-work.service";

@Module({
  controllers: [UnitOfWorkController],
  providers: [
    TransactionManagerService,
    UnitOfWorkContext,
    UnitOfWorkRegistry,
    UnitOfWorkService,
  ],
  exports: [UnitOfWorkService, UnitOfWorkContext, UnitOfWorkRegistry],
})
export class UnitOfWorkModule {}
