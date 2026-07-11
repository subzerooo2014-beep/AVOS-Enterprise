import { Body, Controller, Post } from "@nestjs/common";
import { QueryBusService } from "./query-bus.service";
import { AvosQuery } from "./query.interface";

@Controller("avos-os/queries")
export class QueryBusController {
  constructor(private readonly queryBus: QueryBusService) {}

  @Post("execute")
  execute(@Body() query: AvosQuery) {
    return this.queryBus.execute(query);
  }
}
