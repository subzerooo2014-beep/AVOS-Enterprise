import { Injectable, NotFoundException } from "@nestjs/common";
import { WarehousesRepository } from "./warehouses.repository";
import { WarehousesMapper } from "./warehouses.mapper";
import { WarehousesSerializer } from "./warehouses.serializer";

@Injectable()
export class WarehousesService {
  constructor(
    private readonly repo: WarehousesRepository,
    private readonly mapper: WarehousesMapper,
    private readonly serializer: WarehousesSerializer,
  ) {}

  async findAll() {
    return this.serializer.serializeMany(
      await this.repo.findAll(),
    );
  }

  async findOne(id: string) {
    const item = await this.repo.findById(id);

    if (!item) {
      throw new NotFoundException("Warehouse not found");
    }

    return this.serializer.serialize(item);
  }

  async create(dto: any) {
    return this.serializer.serialize(
      await this.repo.create(
        this.mapper.toCreateData(dto),
      ),
    );
  }

  async update(id: string, dto: any) {
    await this.findOne(id);

    return this.serializer.serialize(
      await this.repo.update(
        id,
        this.mapper.toUpdateData(dto),
      ),
    );
  }
}
