import { Injectable } from '@nestjs/common';
import { SecurityIncident } from './enterprise-zero-trust-security.types';

@Injectable()
export class EnterpriseSecurityCommandCenterService {
  private readonly incidents: SecurityIncident[] = [];

  register(incident: SecurityIncident): SecurityIncident {
    const stored = { ...incident };
    this.incidents.push(stored);
    return { ...stored };
  }

  summary() {
    return {
      total: this.incidents.length,
      active: this.incidents.filter(
        (incident) => incident.status !== 'resolved',
      ).length,
      critical: this.incidents.filter(
        (incident) => incident.severity === 'critical',
      ).length,
      contained: this.incidents.filter(
        (incident) => incident.status === 'contained',
      ).length,
    };
  }
}