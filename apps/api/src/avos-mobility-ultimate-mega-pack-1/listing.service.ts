import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateListingDto } from './dto/create-listing.dto';
import { MobilityPersistenceService } from './mobility-persistence.service';
import { MobilityAuditService } from './mobility-audit.service';
import { ListingRecord } from './mobility.types';
import { VehicleService } from './vehicle.service';

@Injectable()
export class ListingService {
  constructor(
    private readonly persistence: MobilityPersistenceService,
    private readonly audit: MobilityAuditService,
    private readonly vehicles: VehicleService,
  ) {}

  async create(dto: CreateListingDto): Promise<ListingRecord> {
    await this.vehicles.findById(dto.vehicleId);
    const store = await this.persistence.read();

    const duplicate = (store.listings as ListingRecord[]).find(
      (item) =>
        item.vehicleId === dto.vehicleId &&
        ['pending_review', 'published', 'reserved'].includes(item.status),
    );
    if (duplicate) {
      throw new BadRequestException('Vehicle already has an active listing');
    }

    const now = new Date().toISOString();
    const listing: ListingRecord = {
      id: randomUUID(),
      vehicleId: dto.vehicleId,
      sellerType: dto.sellerType,
      sellerId: dto.sellerId,
      title: dto.title.trim(),
      description: dto.description,
      status: 'pending_review',
      featured: false,
      createdAt: now,
      updatedAt: now,
    };

    store.listings.push(listing);
    await this.persistence.write(store);
    await this.audit.record('listing.created', 'listing', listing.id, {
      vehicleId: listing.vehicleId,
    });
    return listing;
  }

  async publish(id: string, approvedBy: string): Promise<ListingRecord> {
    if (!approvedBy.startsWith('human:')) {
      throw new BadRequestException('Human Final Authority approval is required');
    }

    const store = await this.persistence.read();
    const listing = (store.listings as ListingRecord[]).find((item) => item.id === id);
    if (!listing) throw new NotFoundException(`Listing ${id} not found`);

    listing.status = 'published';
    listing.publishedAt = new Date().toISOString();
    listing.updatedAt = listing.publishedAt;
    await this.persistence.write(store);
    await this.audit.record('listing.published', 'listing', listing.id, { approvedBy });
    return listing;
  }

  async list(status?: string): Promise<ListingRecord[]> {
    const store = await this.persistence.read();
    const listings = store.listings as ListingRecord[];
    return status ? listings.filter((item) => item.status === status) : listings;
  }

  async count(): Promise<number> {
    const store = await this.persistence.read();
    return store.listings.length;
  }
}