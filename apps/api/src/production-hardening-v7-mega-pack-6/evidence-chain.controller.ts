import {
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { AppendEvidenceChainDto } from "./dto/append-evidence-chain.dto";
import { EvidenceChainService } from "./evidence-chain.service";

@Controller(
  "production-hardening-v7/mega-pack-6/evidence-chain",
)
export class EvidenceChainController {
  constructor(
    private readonly evidence:
      EvidenceChainService,
  ) {}

  @Post()
  append(
    @Body()
    dto: AppendEvidenceChainDto,
  ) {
    return this.evidence.append(dto);
  }

  @Get()
  list() {
    return this.evidence.list();
  }

  @Get("latest")
  latest() {
    return this.evidence.latest();
  }

  @Get("verify")
  verify() {
    return this.evidence.verify();
  }
}
