import {
  Controller,
  Get,
} from "@nestjs/common";
import { RuntimeResilienceStatusService } from "../services/runtime-resilience-status.service";

@Controller("production-hardening-v8-mega-pack-3")
export class RuntimeResilienceStatusController {
  constructor(
    private readonly status:
      RuntimeResilienceStatusService,
  ) {}

  @Get("status")
  snapshot() {
    return this.status.snapshot();
  }

  @Get("health")
  health() {
    return this.status.health();
  }
}
