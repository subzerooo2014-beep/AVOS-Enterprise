import { Injectable } from '@nestjs/common';

@Injectable()
export class MobilityCapabilityRegistryService {
  private readonly capabilities = [
    { id: 'mobility.marketplace', status: 'operational', phase: 'launch' },
    { id: 'mobility.vehicles', status: 'operational', phase: 'launch' },
    { id: 'mobility.dealers', status: 'operational', phase: 'launch' },
    { id: 'mobility.listings', status: 'operational', phase: 'launch' },
    { id: 'mobility.search', status: 'operational', phase: 'launch' },
    { id: 'mobility.ai.pricing', status: 'bootstrap', phase: 'launch' },
    { id: 'mobility.ai.recommendations', status: 'bootstrap', phase: 'launch' },
    { id: 'mobility.media', status: 'contract-ready', phase: 'next' },
    { id: 'mobility.messaging', status: 'contract-ready', phase: 'next' },
    { id: 'mobility.notifications', status: 'contract-ready', phase: 'next' },
    { id: 'mobility.payments', status: 'boundary-reserved', phase: 'growth' },
    { id: 'mobility.financing', status: 'boundary-reserved', phase: 'growth' },
    { id: 'mobility.insurance', status: 'boundary-reserved', phase: 'growth' },
    { id: 'mobility.auctions', status: 'boundary-reserved', phase: 'growth' },
    { id: 'mobility.fleet', status: 'boundary-reserved', phase: 'growth' },
    { id: 'mobility.rental', status: 'boundary-reserved', phase: 'growth' },
    { id: 'mobility.inspection', status: 'boundary-reserved', phase: 'growth' },
    { id: 'mobility.logistics', status: 'boundary-reserved', phase: 'growth' },
    { id: 'mobility.government', status: 'adapter-boundary', phase: 'global' },
    { id: 'mobility.globalization', status: 'operational', phase: 'launch' },
  ];

  list() {
    return this.capabilities;
  }

  summary() {
    return {
      total: this.capabilities.length,
      operational: this.capabilities.filter((item) => item.status === 'operational').length,
      bootstrap: this.capabilities.filter((item) => item.status === 'bootstrap').length,
      futureBoundaries: this.capabilities.filter((item) =>
        ['boundary-reserved', 'adapter-boundary', 'contract-ready'].includes(item.status),
      ).length,
    };
  }
}