import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import {
  CreateRuntimeSloDto,
  EvaluateRuntimeSloDto,
} from "../dto";
import {
  RuntimeSloService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/slos",
)
export class RuntimeSloController {
  constructor(
    private readonly slos:
      RuntimeSloService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateRuntimeSloDto,
  ) {
    return this.slos.create(dto);
  }

  @Post(":id/evaluate")
  evaluate(
    @Param("id")
    id: string,
    @Body()
    dto:
      EvaluateRuntimeSloDto,
  ) {
    return this.slos
      .evaluate(id, dto);
  }

  @Get()
  listDefinitions() {
    return this.slos
      .listDefinitions();
  }

  @Get("evaluations")
  listEvaluations() {
    return this.slos
      .listEvaluations();
  }

  @Get("compliance")
  compliance(
    @Query("environment")
    environment: string,
    @Query("namespace")
    namespace: string,
    @Query("service")
    service: string,
  ) {
    return this.slos
      .getServiceCompliance(
        environment,
        namespace,
        service,
      );
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.slos.get(id);
  }
}
