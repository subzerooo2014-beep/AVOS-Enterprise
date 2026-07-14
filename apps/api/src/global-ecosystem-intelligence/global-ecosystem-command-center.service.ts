import { Injectable } from '@nestjs/common';
import { EcosystemPartner } from './global-ecosystem-intelligence.types';

@Injectable()
export class GlobalEcosystemCommandCenterService {
  private readonly partners: EcosystemPartner[] = [];

  register(partner: EcosystemPartner): EcosystemPartner {
    const stored = { ...partner };
    this.partners.push(stored);
    return { ...stored };
  }

  summary() {
    return {
      total: this.partners.length,
      active: this.partners.filter((partner) => partner.status === 'active')
        .length,
      atRisk: this.partners.filter((partner) => partner.status === 'at-risk')
        .length,
      regions: [...new Set(this.partners.map((partner) => partner.region))],
      categories: [...new Set(this.partners.map((partner) => partner.category))],
    };
  }
}