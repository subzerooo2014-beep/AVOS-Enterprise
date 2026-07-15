import { Injectable } from '@nestjs/common';
import { CustomerInteraction } from './enterprise-crm-growth.types';

@Injectable()
export class CustomerCommunicationHubService {
  summarize(interactions: CustomerInteraction[]) {
    return {
      total: interactions.length,
      inbound: interactions.filter(
        (interaction) => interaction.direction === 'inbound',
      ).length,
      outbound: interactions.filter(
        (interaction) => interaction.direction === 'outbound',
      ).length,
      channels: [...new Set(interactions.map((item) => item.channel))],
    };
  }
}