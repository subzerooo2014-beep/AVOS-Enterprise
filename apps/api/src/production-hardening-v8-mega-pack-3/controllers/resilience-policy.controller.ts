import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateResiliencePolicyDto,
  RuntimeActorDto,
} from "../dto";
import { ResiliencePolicyService } from "../services/resilience-policy.service";

@Controller("production-hardening-v8-mega-pack-3/policies")
export class ResiliencePolicyController {
  constructor(
    private readonly policies: ResiliencePolicyService,
  ) {}

  @Post()
  create(@Body() dto: CreateResiliencePolicyDto) {
    return this.policies.create(dto);
  }

  @Get()
  list() {
    return this.policies.list();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.policies.get(id);
  }

  @Post(":id/activate")
  activate(
    @Param("id") id: string,
    @Body() actor: RuntimeActorDto,
  ) {
    return this.policies.activate(id, actor);
  }

  @Post(":id/disable")
  disable(
    @Param("id") id: string,
    @Body() actor: RuntimeActorDto,
  ) {
    return this.policies.disable(id, actor);
  }
}
