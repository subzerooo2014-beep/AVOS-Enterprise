import { Injectable } from '@nestjs/common';
import {
  AccessRequest,
  BehaviorSignal,
  SecurityIncident,
  SecurityPolicy,
} from './enterprise-zero-trust-security.types';
import { EnterpriseZeroTrustEngineService } from './enterprise-zero-trust-engine.service';
import { ContinuousIdentityVerificationService } from './continuous-identity-verification.service';
import { AdaptiveAccessPolicyEngineService } from './adaptive-access-policy-engine.service';
import { DeviceTrustIntelligenceService } from './device-trust-intelligence.service';
import { BehavioralThreatDetectionService } from './behavioral-threat-detection.service';
import { PrivilegedAccessGovernanceService } from './privileged-access-governance.service';
import { SecurityPostureIntelligenceService } from './security-posture-intelligence.service';
import { AutonomousIncidentResponseService } from './autonomous-incident-response.service';
import { EnterpriseSecurityCommandCenterService } from './enterprise-security-command-center.service';

@Injectable()
export class EnterpriseZeroTrustSecurityOrchestratorService {
  constructor(
    private readonly zeroTrust: EnterpriseZeroTrustEngineService,
    private readonly identity: ContinuousIdentityVerificationService,
    private readonly policy: AdaptiveAccessPolicyEngineService,
    private readonly device: DeviceTrustIntelligenceService,
    private readonly behavior: BehavioralThreatDetectionService,
    private readonly privileged: PrivilegedAccessGovernanceService,
    private readonly posture: SecurityPostureIntelligenceService,
    private readonly response: AutonomousIncidentResponseService,
    private readonly commandCenter: EnterpriseSecurityCommandCenterService,
  ) {}

  run(input: {
    request: AccessRequest;
    baselinePolicy: SecurityPolicy;
    behaviorSignals: BehaviorSignal[];
    incident?: SecurityIncident;
  }) {
    const adaptedPolicy = this.policy.adapt(
      input.request,
      input.baselinePolicy,
    );
    const identity = this.identity.verify(input.request.identity);
    const device = this.device.evaluate(input.request.device);
    const access = this.zeroTrust.evaluate(
      input.request,
      [adaptedPolicy],
    );
    const behavior = this.behavior.analyze(input.behaviorSignals);
    const privileged = this.privileged.evaluate([input.request]);
    const posture = this.posture.assess(
      [input.request.identity],
      [input.request.device],
    );

    let incidentResponse = null;
    let commandCenter = this.commandCenter.summary();

    if (input.incident) {
      incidentResponse = this.response.respond(input.incident);
      this.commandCenter.register({
        ...input.incident,
        status: incidentResponse.nextStatus as SecurityIncident['status'],
      });
      commandCenter = this.commandCenter.summary();
    }

    return {
      adaptedPolicy,
      identity,
      device,
      access,
      behavior,
      privileged,
      posture,
      incidentResponse,
      commandCenter,
    };
  }
}