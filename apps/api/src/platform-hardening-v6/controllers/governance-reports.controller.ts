import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { GenerateComplianceReportDto } from "../dto/generate-compliance-report.dto";
import { GenerateEvidencePackageDto } from "../dto/generate-evidence-package.dto";
import { GovernanceComplianceReportService } from "../services/governance-compliance-report.service";
import { GovernanceEvidenceVaultService } from "../services/governance-evidence-vault.service";
import { GovernanceRecordVerificationService } from "../services/governance-record-verification.service";
import { V6DiagnosticsTokenGuard } from "../services/v6-diagnostics-token.guard";

@Controller(
  "platform-hardening/v6/governance",
)
@UseGuards(V6DiagnosticsTokenGuard)
export class GovernanceReportsController {
  constructor(
    private readonly compliance:
      GovernanceComplianceReportService,
    private readonly evidence:
      GovernanceEvidenceVaultService,
    private readonly verification:
      GovernanceRecordVerificationService,
  ) {}

  @Post("compliance/generate")
  async generateCompliance(
    @Body()
    dto: GenerateComplianceReportDto,
    @Req()
    request: any,
  ) {
    return {
      success: true,
      snapshot:
        await this.compliance.generate({
          reportType:
            dto.reportType ??
            "full",
          generatedBy:
            dto.generatedBy ??
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

  @Get("compliance")
  async listCompliance(
    @Query("limit")
    limit?: string,
  ) {
    return {
      success: true,
      snapshots:
        await this.compliance.findAll(
          Number(limit) || 100,
        ),
    };
  }

  @Get("compliance/latest")
  async latestCompliance() {
    return {
      success: true,
      snapshot:
        await this.compliance.latest(),
    };
  }

  @Get("compliance/:id")
  async getCompliance(
    @Param("id")
    id: string,
  ) {
    return {
      success: true,
      snapshot:
        await this.compliance.findOne(id),
    };
  }

  @Get("compliance/:id/verify")
  async verifyCompliance(
    @Param("id")
    id: string,
  ) {
    return {
      success: true,
      verification:
        await this.verification
          .verifyCompliance(id),
    };
  }

  @Post("evidence/generate")
  async generateEvidence(
    @Body()
    dto: GenerateEvidencePackageDto,
    @Req()
    request: any,
  ) {
    return {
      success: true,
      package:
        await this.evidence.generate({
          packageType:
            dto.packageType ??
            "full_governance",
          description:
            dto.description,
          generatedBy:
            dto.generatedBy ??
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

  @Get("evidence")
  async listEvidence(
    @Query("limit")
    limit?: string,
  ) {
    return {
      success: true,
      packages:
        await this.evidence.findAll(
          Number(limit) || 100,
        ),
    };
  }

  @Get("evidence/latest")
  async latestEvidence() {
    return {
      success: true,
      package:
        await this.evidence.latest(),
    };
  }

  @Get("evidence/:id")
  async getEvidence(
    @Param("id")
    id: string,
  ) {
    return {
      success: true,
      package:
        await this.evidence.findOne(id),
    };
  }

  @Get("evidence/:id/verify")
  async verifyEvidence(
    @Param("id")
    id: string,
  ) {
    return {
      success: true,
      verification:
        await this.verification
          .verifyEvidence(id),
    };
  }
}
