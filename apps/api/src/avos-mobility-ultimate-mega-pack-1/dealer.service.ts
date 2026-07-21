import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { MobilityPersistenceService } from './mobility-persistence.service';
import { MobilityAuditService } from './mobility-audit.service';
import { DealerRecord } from './mobility.types';

@Injectable()
export class DealerService {
  constructor(
    private readonly persistence: MobilityPersistenceService,
    private readonly audit: MobilityAuditService,
  ) {}

  async create(dto: CreateDealerDto): Promise<DealerRecord> {
    const store = await this.persistence.read();
    const now = new Date().toISOString();
    const dealer: DealerRecord = {
      id: randomUUID(),
      name: dto.name.trim(),
      countryCode: dto.countryCode.toUpperCase(),
      city: dto.city,
      verified: dto.verified ?? false,
      trustScore: dto.verified ? 70 : 40,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    store.dealers.push(dealer);
    await this.persistence.write(store);
    await this.audit.record('dealer.created', 'dealer', dealer.id, {
      name: dealer.name,
    });
    return dealer;
  }

  async list(): Promise<DealerRecord[]> {
    const store = await this.persistence.read();
    return store.dealers as DealerRecord[];
  }

  async findById(id: string): Promise<DealerRecord> {
    const store = await this.persistence.read();
    const dealer = (store.dealers as DealerRecord[]).find((item) => item.id === id);
    if (!dealer) throw new NotFoundException(`Dealer ${id} not found`);
    return dealer;
  }

  async count(): Promise<number> {
    const store = await this.persistence.read();
    return store.dealers.length;
  }
}