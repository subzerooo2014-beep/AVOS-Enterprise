import {
  Controller,
  Get,
} from "@nestjs/common";
import { RuntimeEvidenceChainService } from "../services/runtime-evidence-chain.service";

@Controller("production-hardening-v8-mega-pack-3/evidence")
export class RuntimeEvidenceController {
  constructor(
    private readonly evidence:
      RuntimeEvidenceChainService,
  ) {}

  @Get()
  list() {
    return this.evidence.list();
  }

  @Get("verify")
  verify() {
    return this.evidence.verify();
  }
}
