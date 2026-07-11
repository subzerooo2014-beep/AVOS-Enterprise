import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateRuntimeGuardrailDto,
  UpdateRuntimeGuardrailStatusDto,
} from "../dto";
import {
  RuntimeGovernanceRequestService,
  RuntimeOperationalGuardrailService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/guardrails",
)
export class RuntimeOperationalGuardrailController {
  constructor(
    private readonly guardrails:
      RuntimeOperationalGuardrailService,
    private readonly requests:
      RuntimeGovernanceRequestService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateRuntimeGuardrailDto,
  ) {
    return this.guardrails.create(
      dto,
    );
  }

  @Get()
  list() {
    return this.guardrails.list();
  }

  @Get("evaluations")
  listEvaluations() {
    return this.guardrails
      .listEvaluations();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.guardrails.get(id);
  }

  @Post(":id/status")
  updateStatus(
    @Param("id")
    id: string,
    @Body()
    dto:
      UpdateRuntimeGuardrailStatusDto,
  ) {
    return this.guardrails
      .updateStatus(id, dto);
  }

  @Post("requests/:requestId/evaluate")
  evaluateRequest(
    @Param("requestId")
    requestId: string,
    @Body()
    runtimeContext:
      Record<string, unknown>,
  ) {
    const request =
      this.requests.get(
        requestId,
      );

    return this.guardrails
      .evaluateRequest(
        request,
        runtimeContext ?? {},
      );
  }
}
