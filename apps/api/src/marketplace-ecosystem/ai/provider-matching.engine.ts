import { Injectable } from "@nestjs/common";
@Injectable()
export class ProviderMatchingEngine {
  match(input: { location: string; serviceType: string; providers: Array<{ id: string; location: string; services: string[]; trustScore: number }> }) {
    return input.providers
      .map((provider) => ({
        providerId: provider.id,
        score:
          (provider.location === input.location ? 40 : 0) +
          (provider.services.includes(input.serviceType) ? 40 : 0) +
          provider.trustScore * 0.2,
      }))
      .sort((a,b) => b.score - a.score);
  }
}
