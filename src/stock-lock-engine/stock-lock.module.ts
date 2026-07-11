import { Module } from "@nestjs/common";
import { StockLockService } from "./stock-lock.service";

@Module({
  providers:[StockLockService],
  exports:[StockLockService],
})
export class StockLockModule {}
