import { Module } from "@nestjs/common";
import { QueryBusController } from "./query-bus.controller";
import { QueryBusService } from "./query-bus.service";

@Module({
  controllers: [QueryBusController],
  providers: [QueryBusService],
  exports: [QueryBusService],
})
export class QueryBusModule {}
