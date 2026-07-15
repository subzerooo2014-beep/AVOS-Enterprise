import { Injectable } from '@nestjs/common';
import { ProviderProfile } from './service-provider-marketplace.types';

@Injectable()
export class WorkshopProviderProfileEngineService {
  rank(providers: ProviderProfile[]) {
    return [...providers]
      .map((provider) => ({
        ...provider,
        trustScore: Math.round(
          provider.rating * 15 +
          (provider.verified ? 20 : 0) +
          Math.min(20, provider.capabilities.length * 4),
        ),
      }))
      .sort((a, b) => b.trustScore - a.trustScore);
  }
}