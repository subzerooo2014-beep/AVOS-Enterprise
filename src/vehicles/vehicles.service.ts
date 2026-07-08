import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { VehiclesRepository } from "./repositories/vehicles.repository";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";

@Injectable()
export class VehiclesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: VehiclesRepository,
  ) {}

  findAll(query: any = {}) {
    return this.repository.findPage(query);
  }

  stats() {
    return this.repository.stats();
  }

  async findOne(id: string) {
    const vehicle = await this.repository.findById(id);

    if (!vehicle) {
      throw new NotFoundException("Vehicle not found");
    }

    return vehicle;
  }

  async create(dto: CreateVehicleDto) {
    const exists = await this.repository.findByVin(dto.vin);

    if (exists) {
      throw new ConflictException("VIN already exists");
    }

    return this.prisma.$transaction(async () => {
      const vehicle = await this.repository.create(dto);

      await this.prisma.auditLog.create({
        data: {
          action: "VEHICLE_CREATED",
          entity: "Vehicle",
          entityId: vehicle.id,
        },
      });

      return vehicle;
    });
  }

  async update(id: string, dto: UpdateVehicleDto) {
    await this.findOne(id);

    if (dto.vin) {
      const exists = await this.repository.findByVin(dto.vin);

      if (exists && exists.id !== id) {
        throw new ConflictException("VIN already exists");
      }
    }

    return this.prisma.$transaction(async () => {
      const vehicle = await this.repository.update(id, dto);

      await this.prisma.auditLog.create({
        data: {
          action: "VEHICLE_UPDATED",
          entity: "Vehicle",
          entityId: id,
        },
      });

      return vehicle;
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.$transaction(async () => {
      await this.repository.delete(id);

      await this.prisma.auditLog.create({
        data: {
          action: "VEHICLE_DELETED",
          entity: "Vehicle",
          entityId: id,
        },
      });

      return { deleted: true };
    });
  }
}
