import { Injectable } from '@nestjs/common';
import { ServiceComplaint } from './service-provider-marketplace.types';

@Injectable()
export class ComplaintsClaimsEngineService {
  prioritize(complaints: ServiceComplaint[]) {
    const weight = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    };

    return [...complaints].sort(
      (a, b) => weight[b.severity] - weight[a.severity],
    );
  }
}