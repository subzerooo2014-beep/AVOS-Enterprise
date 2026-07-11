import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateResilienceActionDto,
  ExecuteResilienceActionDto,
} from "../dto";
import { ResilienceActionService } from "../services/resilience-action.service";

@Controller("production-hardening-v8-mega-pack-3/actions")
export class ResilienceActionController {
  constructor(
    private readonly actions: ResilienceActionService,
  ) {}

  @Post()
  create(@Body() dto: CreateResilienceActionDto) {
    return this.actions.create(dto);
  }

  @Get()
  list() {
    return this.actions.list();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.actions.get(id);
  }

  @Post(":id/approve")
  approve(
    @Param("id") id: string,
    @Body() dto: ExecuteResilienceActionDto,
  ) {
    return this.actions.approve(id, dto);
  }

  @Post(":id/execute")
  execute(
    @Param("id") id: string,
    @Body() dto: ExecuteResilienceActionDto,
  ) {
    return this.actions.execute(id, dto);
  }

  @Post(":id/cancel")
  cancel(
    @Param("id") id: string,
    @Body() dto: ExecuteResilienceActionDto,
  ) {
    return this.actions.cancel(id, dto);
  }
}
