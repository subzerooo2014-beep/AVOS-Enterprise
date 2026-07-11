import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateVersionedPolicyDto } from "../dto/create-versioned-policy.dto";
import { RollbackPolicyDto } from "../dto/rollback-policy.dto";
import { UpdateVersionedPolicyDto } from "../dto/update-versioned-policy.dto";
import { PolicyVersioningService } from "../services/policy-versioning.service";
import { V6DiagnosticsTokenGuard } from "../services/v6-diagnostics-token.guard";

@Controller("platform-hardening/v6/policies")
@UseGuards(V6DiagnosticsTokenGuard)
export class PolicyVersioningController {
  constructor(
    private readonly policies:
      PolicyVersioningService,
  ) {}

  @Get()
  async findAll() {
    return {
      success: true,
      summary:
        await this.policies.getSummary(),
      policies:
        await this.policies.findAll(),
    };
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
  ) {
    return {
      success: true,
      policy:
        await this.policies.findOne(id),
    };
  }

  @Get(":id/history")
  async history(
    @Param("id") id: string,
    @Query("limit") limit?: string,
  ) {
    return {
      success: true,
      versions:
        await this.policies.history(
          id,
          Number(limit) || 100,
        ),
    };
  }

  @Get(":id/compare/:from/:to")
  async compare(
    @Param("id") id: string,
    @Param("from", ParseIntPipe)
    fromVersion: number,
    @Param("to", ParseIntPipe)
    toVersion: number,
  ) {
    return {
      success: true,
      comparison:
        await this.policies.compare(
          id,
          fromVersion,
          toVersion,
        ),
    };
  }

  @Post()
  async create(
    @Body()
    dto: CreateVersionedPolicyDto,
    @Req()
    request: any,
  ) {
    return {
      success: true,
      result:
        await this.policies.create(
          dto,
          this.getContext(request),
        ),
    };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body()
    dto: UpdateVersionedPolicyDto,
    @Req()
    request: any,
  ) {
    return {
      success: true,
      result:
        await this.policies.update(
          id,
          dto,
          this.getContext(request),
        ),
    };
  }

  @Post(":id/rollback")
  async rollback(
    @Param("id") id: string,
    @Body()
    dto: RollbackPolicyDto,
    @Req()
    request: any,
  ) {
    return {
      success: true,
      result:
        await this.policies.rollback(
          id,
          dto,
          this.getContext(request),
        ),
    };
  }

  private getContext(
    request: any,
  ) {
    return {
      correlationId:
        request.headers?.[
          "x-correlation-id"
        ],
      traceId:
        request.headers?.[
          "x-trace-id"
        ],
      actor:
        request.headers?.[
          "x-avos-actor"
        ] ??
        "platform-owner",
    };
  }
}
