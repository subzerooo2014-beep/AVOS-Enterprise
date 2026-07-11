import { Injectable, NotFoundException } from "@nestjs/common";
import { SuppliersRepository } from "./suppliers.repository";
import { SuppliersMapper } from "./suppliers.mapper";
import { SuppliersSerializer } from "./suppliers.serializer";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { SUPPLIERS_MESSAGES } from "./constants/suppliers.constants";

@Injectable()
export class SuppliersService {
  constructor(
    private readonly repo: SuppliersRepository,
    private readonly mapper: SuppliersMapper,
    private readonly serializer: SuppliersSerializer,
  ) {}

  async findAll() {
    const items = await this.repo.findAll();
    return this.serializer.serializeMany(items);
  }

  async findOne(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException(SUPPLIERS_MESSAGES.NOT_FOUND);
    return this.serializer.serialize(item);
  }

  async create(dto: CreateSupplierDto) {
    const item = await this.repo.create(this.mapper.toCreateData(dto));
    return this.serializer.serialize(item);
  }

  async update(id: string, dto: UpdateSupplierDto) {
    await this.findOne(id);
    const item = await this.repo.update(id, this.mapper.toUpdateData(dto));
    return this.serializer.serialize(item);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
