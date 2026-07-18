import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import { FailureDiagnosisRequest } from "./failure-diagnosis.contracts";
import { FailureDiagnosisEngineService } from "./failure-diagnosis-engine.service";

@Controller("avos/factory/v1/failure-diagnosis")
export class FailureDiagnosisController {
  constructor(
    private readonly engine: FailureDiagnosisEngineService
  ) {}

  @Post("diagnose")
  diagnose(
    @Body() request: FailureDiagnosisRequest
  ) {
    return this.engine.diagnose(request);
  }

  @Post("smoke/run")
  smoke() {
    return this.engine.smoke();
  }

  @Get("health")
  health() {
    return this.engine.health();
  }
}
