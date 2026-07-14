import { Injectable } from '@nestjs/common';

@Injectable()
export class CrossFunctionalCoordinationMeshService {
  coordinate(
    domains: string[],
    missionId: string,
  ): {
    missionId: string;
    channels: Array<{ from: string; to: string; status: 'connected' }>;
    connectedDomains: number;
  } {
    const uniqueDomains = [...new Set(domains)];
    const channels: Array<{
      from: string;
      to: string;
      status: 'connected';
    }> = [];

    for (let left = 0; left < uniqueDomains.length; left += 1) {
      for (let right = left + 1; right < uniqueDomains.length; right += 1) {
        channels.push({
          from: uniqueDomains[left],
          to: uniqueDomains[right],
          status: 'connected',
        });
      }
    }

    return {
      missionId,
      channels,
      connectedDomains: uniqueDomains.length,
    };
  }
}