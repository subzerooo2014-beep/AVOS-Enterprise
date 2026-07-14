import { Body, Controller, Get, Post } from "@nestjs/common";
import { GovernmentPlatformService } from "./government-platform.service";
import { GovernmentProviderRegistryService } from "./services/government-provider-registry.service";
import { GovernmentWebhookService } from "./services/government-webhook.service";
import { GovernmentDashboardService } from "./services/government-dashboard.service";
import { GovernmentReportingService } from "./services/government-reporting.service";
import { GovernmentConsentService } from "./compliance/government-consent.service";
import { GovernmentEvidenceService } from "./compliance/government-evidence.service";
import { GovernmentComplianceService } from "./compliance/government-compliance.service";
import { GovernmentHealthService } from "./services/government-health.service";

@Controller("government-platform")
export class GovernmentPlatformController {
  constructor(
    private readonly platform: GovernmentPlatformService,
    private readonly registry: GovernmentProviderRegistryService,
    private readonly webhooks: GovernmentWebhookService,
    private readonly dashboard: GovernmentDashboardService,
    private readonly reports: GovernmentReportingService,
    private readonly consents: GovernmentConsentService,
    private readonly evidence: GovernmentEvidenceService,
    private readonly compliance: GovernmentComplianceService,
    private readonly healthService: GovernmentHealthService,
  ) {}

  @Get("health")
  health() {
    return this.healthService.status();
  }

  @Get("providers")
  providers() {
    return {
      success: true,
      providers: this.registry.list(),
    };
  }

  @Post("uae-pass/login")
  uaePassLogin(@Body() body: any) {
    return {
      success: true,
      result: this.platform.uaePass.login(
        body.state,
        body.redirectUri,
      ),
    };
  }

  @Post("uae-pass/callback")
  uaePassCallback(@Body() body: any) {
    return {
      success: true,
      result: this.platform.uaePass.callback(
        body.code,
        body.state,
      ),
    };
  }

  @Post("emirates-id/verify")
  emiratesIdVerify(@Body() body: any) {
    return {
      success: true,
      result: this.platform.emiratesId.verify(
        body.emiratesId,
        body.dateOfBirth,
      ),
    };
  }

  @Post("rta/vehicle")
  rtaVehicle(@Body() body: any) {
    return {
      success: true,
      result: this.platform.rta.vehicleLookup(body.vin),
    };
  }

  @Post("rta/fines")
  rtaFines(@Body() body: any) {
    return {
      success: true,
      result: this.platform.rta.fines(
        body.trafficFileNumber,
      ),
    };
  }

  @Post("moi/vehicle")
  moiVehicle(@Body() body: any) {
    return {
      success: true,
      result: this.platform.moi.vehicleLookup(
        body.vin,
        body.emirate,
      ),
    };
  }

  @Post("moi/fines")
  moiFines(@Body() body: any) {
    return {
      success: true,
      result: this.platform.moi.fines(body.emiratesId),
    };
  }

  @Post("salik/account")
  salikAccount(@Body() body: any) {
    return {
      success: true,
      result: this.platform.salik.account(
        body.accountNumber,
      ),
    };
  }

  @Post("salik/balance")
  salikBalance(@Body() body: any) {
    return {
      success: true,
      result: this.platform.salik.balance(
        body.accountNumber,
      ),
    };
  }

  @Post("evg/history")
  evgHistory(@Body() body: any) {
    return {
      success: true,
      result: this.platform.evg.history(body.vin),
    };
  }

  @Post("evg/accidents")
  evgAccidents(@Body() body: any) {
    return {
      success: true,
      result: this.platform.evg.accidents(body.vin),
    };
  }

  @Post("customs/cases")
  customsCase(@Body() body: any) {
    return {
      success: true,
      result: this.platform.customs.createCase(body),
    };
  }

  @Post("customs/status")
  customsStatus(@Body() body: any) {
    return {
      success: true,
      result: this.platform.customs.status(
        body.caseReference,
      ),
    };
  }

  @Post("ownership-transfer/start")
  ownershipStart(@Body() body: any) {
    return {
      success: true,
      result: this.platform.ownershipTransfer.start(body),
    };
  }

  @Post("ownership-transfer/approve")
  ownershipApprove(@Body() body: any) {
    return {
      success: true,
      result: this.platform.ownershipTransfer.approve(
        body.transferId,
        body.actorRole,
      ),
    };
  }

  @Post("ownership-transfer/complete")
  ownershipComplete(@Body() body: any) {
    return {
      success: true,
      result: this.platform.ownershipTransfer.complete(
        body.transferId,
        body.paymentReference,
        body.authorityReference,
      ),
    };
  }

  @Post("webhooks")
  webhook(@Body() body: any) {
    return {
      success: true,
      event: this.webhooks.receive(body),
    };
  }

  @Post("consents")
  consent(@Body() body: any) {
    return {
      success: true,
      consent: this.consents.create(body),
    };
  }

  @Post("evidence")
  evidenceCreate(@Body() body: any) {
    return {
      success: true,
      evidence: this.evidence.create(body),
    };
  }

  @Post("compliance/evaluate")
  complianceEvaluate(@Body() body: any) {
    return {
      success: true,
      result: this.compliance.evaluate(body),
    };
  }

  @Post("reports")
  report(@Body() body: any) {
    return {
      success: true,
      report: this.reports.create(body),
    };
  }

  @Get("operations/dashboard")
  operations() {
    return {
      success: true,
      dashboard: this.dashboard.summary(),
    };
  }
}
