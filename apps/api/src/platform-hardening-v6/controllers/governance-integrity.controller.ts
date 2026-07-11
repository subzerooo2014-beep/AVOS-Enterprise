import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { RunIntegrityScanDto } from "../dto/run-integrity-scan.dto";
import { GovernanceIntegrityScannerService } from "../services/governance-integrity-scanner.service";
import { GovernanceSignatureBackfillService } from "../services/governance-signature-backfill.service";
import { V6DiagnosticsTokenGuard } from "../services/v6-diagnostics-token.guard";

@Controller(
  "platform-hardening/v6/integrity",
)
@UseGuards(V6DiagnosticsTokenGuard)
export class GovernanceIntegrityController {
  constructor(
    private readonly scanner:
      GovernanceIntegrityScannerService,
    private readonly backfill:
      GovernanceSignatureBackfillService,
  ) {}

  @Get("summary")
  async summary() {
    return {
      success: true,
      integrity:
        await this.scanner.getSummary(),
    };
  }

  @Get("history")
  async history(
    @Query("limit")
    limit?: string,
  ) {
    return {
      success: true,
      scans:
        await this.scanner.getHistory(
          Number(limit) || 100,
        ),
    };
  }

  @Post("scan")
  async scan(
    @Body()
    dto: RunIntegrityScanDto,
    @Req()
    request: any,
  ) {
    return {
      success: true,
      result:
        await this.scanner.run({
          scope:
            dto.scope ?? "all",
          executedBy:
            dto.executedBy ??
            request.headers?.[
              "x-avos-actor"
            ] ??
            "platform-owner",
          correlationId:
            request.headers?.[
              "x-correlation-id"
            ],
          traceId:
            request.headers?.[
              "x-trace-id"
            ],
        }),
    };
  }

  @Post("signatures/backfill")
  async backfillSignatures() {
    return {
      success: true,
      result:
        await this.backfill
          .backfillAll(),
    };
  }
}
