import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  ApproveResilienceConfigurationDto,
  CreateResilienceConfigurationDto,
  RollbackResilienceConfigurationDto,
  RuntimeActorDto,
  SubmitResilienceConfigurationDto,
} from "../dto";
import { ResilienceConfigurationService } from "../services/resilience-configuration.service";

@Controller("production-hardening-v8-mega-pack-3/configurations")
export class ResilienceConfigurationController {
  constructor(
    private readonly configurations: ResilienceConfigurationService,
  ) {}

  @Post()
  create(@Body() dto: CreateResilienceConfigurationDto) {
    return this.configurations.create(dto);
  }

  @Get()
  list() {
    return this.configurations.list();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.configurations.get(id);
  }

  @Post(":id/submit")
  submit(
    @Param("id") id: string,
    @Body() dto: SubmitResilienceConfigurationDto,
  ) {
    return this.configurations.submit(id, dto);
  }

  @Post(":id/approval")
  approve(
    @Param("id") id: string,
    @Body() dto: ApproveResilienceConfigurationDto,
  ) {
    return this.configurations.approve(id, dto);
  }

  @Post(":id/activate")
  activate(
    @Param("id") id: string,
    @Body() actor: RuntimeActorDto,
  ) {
    return this.configurations.activate(id, actor);
  }

  @Post(":id/rollback")
  rollback(
    @Param("id") id: string,
    @Body() dto: RollbackResilienceConfigurationDto,
  ) {
    return this.configurations.rollback(id, dto);
  }
}
