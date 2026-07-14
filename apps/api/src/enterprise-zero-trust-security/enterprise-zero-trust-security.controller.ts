import { Body, Controller, Get, Post } from '@nestjs/common';
import { EvaluateAccessDto } from './dto/evaluate-access.dto';
import { BehaviorAnalysisDto } from './dto/behavior-analysis.dto';
import { IncidentResponseDto } from './dto/incident-response.dto';
import { EnterpriseZeroTrustEngineService } from './enterprise-zero-trust-engine.service';
import { BehavioralThreatDetectionService } from './behavioral-threat-detection.service';
import { AutonomousIncidentResponseService } from './autonomous-incident-response.service';
import { ZeroTrustSecurityDashboardService } from './zero-trust-security-dashboard.service';
import { ENTERPRISE_ZERO_TRUST_SECURITY_CAPABILITIES } from './enterprise-zero-trust-security.types';

@Controller('enterprise-zero-trust-security')
export class EnterpriseZeroTrustSecurityController {
  constructor(
    private readonly zeroTrust: EnterpriseZeroTrustEngineService,
    private readonly behavior: BehavioralThreatDetectionService,
    private readonly response: AutonomousIncidentResponseService,
    private readonly dashboard: ZeroTrustSecurityDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle M — Enterprise Security & Zero Trust Completion',
      count: ENTERPRISE_ZERO_TRUST_SECURITY_CAPABILITIES.length,
      capabilities: ENTERPRISE_ZERO_TRUST_SECURITY_CAPABILITIES,
    };
  }

  @Post('access/evaluate')
  evaluateAccess(@Body() input: EvaluateAccessDto) {
    return this.zeroTrust.evaluate(input, [
      {
        id: 'default-zero-trust-policy',
        name: 'Default Zero Trust Policy',
        minimumIdentityScore: 70,
        minimumDeviceScore: 70,
        maximumSessionRisk: 40,
        privilegedActions: [
          'delete',
          'impersonate',
          'rotate-key',
          'override-policy',
        ],
      },
    ]);
  }

  @Post('behavior/analyze')
  analyzeBehavior(@Body() input: BehaviorAnalysisDto) {
    return this.behavior.analyze(input.signals);
  }

  @Post('incidents/respond')
  respondToIncident(@Body() input: IncidentResponseDto) {
    return this.response.respond({
      id: input.id,
      title: input.title,
      severity: input.severity,
      source: input.source,
      affectedAssets: input.affectedAssets,
      detectedAt: new Date().toISOString(),
      status: 'detected',
    });
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}