import { Module } from "@nestjs/common";
import { TransactionLifecycleController } from "./transaction-lifecycle.controller";
import { TransactionLifecycleService } from "./transaction-lifecycle.service";

@Module({
  controllers: [TransactionLifecycleController],
  providers: [TransactionLifecycleService],
  exports: [TransactionLifecycleService],
})
export class TransactionLifecycleModule {}