import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowStandardsRegistryService } from "./core-flow-standards-registry.service";
import { CoreFlowConformanceService } from "./core-flow-conformance.service";
import { CoreFlowCertificationService } from "./core-flow-certification.service";
import { CoreFlowCompatibilityService } from "./core-flow-compatibility.service";
import { CoreFlowStandardsGovernanceService } from "./core-flow-standards-governance.service";

@Controller("core-flow-standards")
export class CoreFlowStandardsController {
  constructor(
    private readonly standards: CoreFlowStandardsRegistryService,
    private readonly conformance: CoreFlowConformanceService,
    private readonly certifications: CoreFlowCertificationService,
    private readonly compatibility: CoreFlowCompatibilityService,
    private readonly governance: CoreFlowStandardsGovernanceService,
  ) {}

  @Post("standards")
  registerStandard(@Body() dto: any) {
    return this.standards.register(dto);
  }

  @Get("standards")
  standardsList(@Query() query: any) {
    return this.standards.findAll(query);
  }

  @Post("standards/:id/activate")
  activateStandard(@Param("id") id: string) {
    return this.standards.activate(id);
  }

  @Post("standards/:id/deprecate")
  deprecateStandard(@Param("id") id: string) {
    return this.standards.deprecate(id);
  }

  @Post("conformance")
  testConformance(@Body() dto: any) {
    return this.conformance.test(
      dto?.executionId,
      dto?.standardId,
      Array.isArray(dto?.capabilities) ? dto.capabilities : [],
    );
  }

  @Get("conformance")
  conformanceList(@Query() query: any) {
    return this.conformance.findAll(query);
  }

  @Post("certifications")
  issueCertification(@Body() dto: any) {
    return this.governance.validateAndCertify(
      dto?.executionId,
      dto,
    );
  }

  @Get("certifications")
  certificationsList(@Query() query: any) {
    return this.certifications.findAll(query);
  }

  @Post("certifications/:id/suspend")
  suspendCertification(@Param("id") id: string) {
    return this.certifications.suspend(id);
  }

  @Post("certifications/:id/revoke")
  revokeCertification(@Param("id") id: string) {
    return this.certifications.revoke(id);
  }

  @Post("compatibility/check")
  checkCompatibility(@Body() dto: any) {
    return this.compatibility.check(dto);
  }

  @Get("compatibility")
  compatibilityList(@Query() query: any) {
    return this.compatibility.findAll(query);
  }

  @Get("dashboard")
  dashboard() {
    return this.governance.dashboard();
  }
}
