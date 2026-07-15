import { Injectable } from '@nestjs/common';
import {
  ListingStatus,
  VehicleListing,
} from './vehicle-marketplace-operations.types';

@Injectable()
export class ListingLifecycleEngineService {
  private readonly listings = new Map<string, VehicleListing>();

  create(
    listing: Omit<VehicleListing, 'status' | 'createdAt' | 'updatedAt'>,
  ): VehicleListing {
    const now = new Date().toISOString();
    const created: VehicleListing = {
      ...listing,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };

    this.listings.set(created.id, created);
    return { ...created };
  }

  transition(id: string, status: ListingStatus): VehicleListing {
    const current = this.listings.get(id);
    if (!current) {
      throw new Error(`Listing not found: ${id}`);
    }

    const updated: VehicleListing = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.listings.set(id, updated);
    return { ...updated };
  }

  get(id: string): VehicleListing | null {
    const listing = this.listings.get(id);
    return listing ? { ...listing } : null;
  }

  list(): VehicleListing[] {
    return [...this.listings.values()].map((listing) => ({ ...listing }));
  }
}