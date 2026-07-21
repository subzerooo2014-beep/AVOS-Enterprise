import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { MobilityPersistenceService } from './mobility-persistence.service';
import { MobilityAuditService } from './mobility-audit.service';
import { VehicleRecord, VehicleSearchQuery } from './mobility.types';

@Injectable()
export class VehicleService {
  constructor(
    private readonly persistence: MobilityPersistenceService,
    private readonly audit: MobilityAuditService,
  ) {}

  async create(dto: CreateVehicleDto): Promise<VehicleRecord> {
    const store = await this.persistence.read();
    const now = new Date().toISOString();
    const record: VehicleRecord = {
      id: randomUUID(),
      vin: dto.vin,
      make: dto.make.trim(),
      model: dto.model.trim(),
      year: dto.year,
      trim: dto.trim,
      mileageKm: dto.mileageKm,
      bodyType: dto.bodyType,
      fuelType: dto.fuelType,
      transmission: dto.transmission,
      color: dto.color,
      condition: dto.condition,
      price: {
        amount: dto.priceAmount,
        currency: dto.currency.toUpperCase(),
      },
      dealerId: dto.dealerId,
      city: dto.city,
      countryCode: dto.countryCode.toUpperCase(),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    store.vehicles.push(record);
    await this.persistence.write(store);
    await this.audit.record('vehicle.created', 'vehicle', record.id, {
      make: record.make,
      model: record.model,
    });
    return record;
  }

  async findById(id: string): Promise<VehicleRecord> {
    const store = await this.persistence.read();
    const vehicle = (store.vehicles as VehicleRecord[]).find((item) => item.id === id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle ${id} not found`);
    }
    return vehicle;
  }

  async search(query: VehicleSearchQuery): Promise<VehicleRecord[]> {
    const store = await this.persistence.read();
    let results = store.vehicles as VehicleRecord[];

    if (query.q) {
      const q = query.q.toLowerCase();
      results = results.filter((item) =>
        [item.make, item.model, item.trim, item.bodyType, item.city]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q)),
      );
    }
    if (query.make) results = results.filter((item) => item.make.toLowerCase() === query.make!.toLowerCase());
    if (query.model) results = results.filter((item) => item.model.toLowerCase() === query.model!.toLowerCase());
    if (query.minYear !== undefined) results = results.filter((item) => item.year >= query.minYear!);
    if (query.maxYear !== undefined) results = results.filter((item) => item.year <= query.maxYear!);
    if (query.minPrice !== undefined) results = results.filter((item) => item.price.amount >= query.minPrice!);
    if (query.maxPrice !== undefined) results = results.filter((item) => item.price.amount <= query.maxPrice!);
    if (query.countryCode) results = results.filter((item) => item.countryCode === query.countryCode!.toUpperCase());
    if (query.city) results = results.filter((item) => item.city?.toLowerCase() === query.city!.toLowerCase());
    if (query.dealerId) results = results.filter((item) => item.dealerId === query.dealerId);
    if (query.status) results = results.filter((item) => item.status === query.status);

    const limit = Math.max(1, Math.min(query.limit ?? 50, 200));
    return results.slice(0, limit);
  }

  async count(): Promise<number> {
    const store = await this.persistence.read();
    return store.vehicles.length;
  }
}