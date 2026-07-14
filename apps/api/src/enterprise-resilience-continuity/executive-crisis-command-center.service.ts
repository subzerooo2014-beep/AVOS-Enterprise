import { Injectable } from '@nestjs/common';
import { CrisisIncident } from './enterprise-resilience-continuity.types';

@Injectable()
export class ExecutiveCrisisCommandCenterService {
  private readonly incidents: CrisisIncident[] = [];

  register(incident: CrisisIncident): CrisisIncident {
    this.incidents.push({ ...incident });
    return { ...incident };
  }

  summary() {
    return {
      total: this.incidents.length,
      active: this.incidents.filter(
        (incident) =>
          incident.status !== 'resolved',
      ).length,
      critical: this.incidents.filter(
        (incident) => incident.severity === 'critical',
      ).length,
      escalated: this.incidents.filter(
        (incident) => incident.status === 'escalated',
      ).length,
    };
  }
}