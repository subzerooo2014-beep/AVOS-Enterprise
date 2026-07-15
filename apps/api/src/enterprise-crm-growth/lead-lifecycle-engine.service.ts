import { Injectable } from '@nestjs/common';
import { Lead } from './enterprise-crm-growth.types';

@Injectable()
export class LeadLifecycleEngineService {
  qualify(leads: Lead[]) {
    return leads.map((lead) => ({
      ...lead,
      status:
        lead.status === 'new' && lead.score >= 70
          ? ('qualified' as const)
          : lead.status,
      priority:
        lead.score >= 85
          ? 'high'
          : lead.score >= 60
            ? 'medium'
            : 'low',
    }));
  }
}