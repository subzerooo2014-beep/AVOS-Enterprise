import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CreatePersistentAuditEventDto } from "../dto/create-persistent-audit-event.dto";
import { PersistentAuditLedgerService } from "../services/persistent-audit-ledger.service";
import { PlatformHardeningV6Service } from "../services/platform-hardening-v6.service";
import { V6DiagnosticsTokenGuard } from "../services/v6-diagnostics-token.guard";

@Controller("platform-hardening/v6")
export class PlatformHardeningV6Controller {
  constructor(
    private readonly hardening:
      PlatformHardeningV6Service,
    private readonly audit:
      PersistentAuditLedgerService,
  ) {}

  @Get("status")
  getStatus() {
    return this.hardening.getStatus();
  }

  @Get("snapshot")
  @UseGuards(V6DiagnosticsTokenGuard)
  getSnapshot() {
    return this.hardening.getSnapshot();
  }

  @Get("audit")
  @UseGuards(V6DiagnosticsTokenGuard)
  async getAudit(
    @Query("limit") limit?: string,
    @Query("eventType")
    eventType?: string,
    @Query("severity")
    severity?: string,
    @Query("actor")
    actor?: string,
    @Query("correlationId")
    correlationId?: string,
  ) {
    return {
      success: true,
      summary:
        await this.audit.getSummary(),
      events:
        await this.audit.findMany({
          limit: Number(limit) || 100,
          eventType,
          severity,
          actor,
          correlationId,
        }),
    };
  }

  @Get("audit/integrity")
  @UseGuards(V6DiagnosticsTokenGuard)
  async verifyIntegrity() {
    return {
      success: true,
      integrity:
        await this.audit.verifyIntegrity(),
    };
  }

  @Get("audit/sequence/:sequence")
  @UseGuards(V6DiagnosticsTokenGuard)
  async getBySequence(
    @Param("sequence", ParseIntPipe)
    sequence: number,
  ) {
    return {
      success: true,
      event:
        await this.audit.findBySequence(
          sequence,
        ),
    };
  }

  @Get("audit/:id")
  @UseGuards(V6DiagnosticsTokenGuard)
  async getById(
    @Param("id") id: string,
  ) {
    return {
      success: true,
      event:
        await this.audit.findOne(id),
    };
  }

  @Post("audit")
  @UseGuards(V6DiagnosticsTokenGuard)
  async append(
    @Body()
    dto: CreatePersistentAuditEventDto,
  ) {
    return {
      success: true,
      event:
        await this.audit.append(dto),
    };
  }
}
