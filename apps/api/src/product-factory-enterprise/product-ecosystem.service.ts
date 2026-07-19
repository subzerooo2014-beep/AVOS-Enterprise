import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MarketplaceRecord } from './product-factory-enterprise.types';
import { ProductFactoryEnterpriseStore } from './product-factory-enterprise.store';

@Injectable()
export class ProductEcosystemService {
  constructor(private readonly store: ProductFactoryEnterpriseStore) {}

  register(input: Omit<MarketplaceRecord, 'id' | 'status'>): MarketplaceRecord {
    const record: MarketplaceRecord = {
      ...input,
      id: `marketplace-product:${input.namespace}:${input.version}`,
      status: 'pending-human-publication',
    };
    this.store.marketplace.set(record.id, record);
    return record;
  }

  publish(id: string, approvedBy: string): MarketplaceRecord {
    if (!approvedBy.startsWith('human:')) {
      throw new BadRequestException('Human Final Authority approval is required.');
    }

    const record = this.store.marketplace.get(id);
    if (!record) {
      throw new NotFoundException(`Marketplace record not found: ${id}`);
    }
    if (!record.globalComplianceReady) {
      throw new BadRequestException('Global Compliance Readiness Gate failed.');
    }

    record.status = 'published';
    record.approvedBy = approvedBy;
    record.publishedAt = new Date().toISOString();
    return record;
  }

  suspend(id: string): MarketplaceRecord {
    const record = this.store.marketplace.get(id);
    if (!record) {
      throw new NotFoundException(`Marketplace record not found: ${id}`);
    }
    record.status = 'suspended';
    return record;
  }

  list(): MarketplaceRecord[] {
    return [...this.store.marketplace.values()];
  }

  ecosystemMetrics() {
    const records = this.list();
    return {
      totalProducts: records.length,
      published: records.filter((record) => record.status === 'published').length,
      pendingHumanPublication: records.filter(
        (record) => record.status === 'pending-human-publication',
      ).length,
      monetized: records.filter((record) => record.monetizationEnabled).length,
      multiTenantReady: records.filter((record) => record.multiTenantReady).length,
      globalComplianceReady: records.filter(
        (record) => record.globalComplianceReady,
      ).length,
    };
  }
}