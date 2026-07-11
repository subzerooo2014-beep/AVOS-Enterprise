import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CatalogQueryDto } from './catalog-query.dto';
import { CreateCatalogItemDto } from './create-catalog-item.dto';
import { UpdateCatalogItemDto } from './update-catalog-item.dto';
import { catalogWhere, toPagination } from './vehicle-catalog.utils';

@Injectable()
export class VehicleCatalogService {
  constructor(private readonly prisma: PrismaService) {}

  private async paginated(delegate: any, query: CatalogQueryDto) {
    const pagination = toPagination(query.page, query.limit);
    const where = catalogWhere(query.search, query.status);

    const [items, total] = await Promise.all([
      delegate.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      delegate.count({ where }),
    ]);

    return {
      items,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit),
      },
    };
  }

  private async findOne(delegate: any, id: string, entity: string) {
    const item = await delegate.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`${entity} not found`);
    return item;
  }

  brands(query: CatalogQueryDto) {
    return this.paginated((this.prisma as any).vehicleBrand, query);
  }

  createBrand(dto: CreateCatalogItemDto) {
    return (this.prisma as any).vehicleBrand.create({
      data: { name: dto.name },
    });
  }

  brand(id: string) {
    return this.findOne((this.prisma as any).vehicleBrand, id, 'Vehicle brand');
  }

  async updateBrand(id: string, dto: UpdateCatalogItemDto) {
    await this.brand(id);
    return (this.prisma as any).vehicleBrand.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async deleteBrand(id: string) {
    await this.brand(id);
    return (this.prisma as any).vehicleBrand.delete({ where: { id } });
  }

  models(query: CatalogQueryDto) {
    return this.paginated((this.prisma as any).vehicleModel, query);
  }

  async createModel(dto: CreateCatalogItemDto) {
    if (!dto.brandId) throw new BadRequestException('brandId is required');

    await this.brand(dto.brandId);

    return (this.prisma as any).vehicleModel.create({
      data: {
        name: dto.name,
        brandId: dto.brandId,
      },
    });
  }

  model(id: string) {
    return this.findOne((this.prisma as any).vehicleModel, id, 'Vehicle model');
  }

  async updateModel(id: string, dto: UpdateCatalogItemDto) {
    await this.model(id);
    return (this.prisma as any).vehicleModel.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async deleteModel(id: string) {
    await this.model(id);
    return (this.prisma as any).vehicleModel.delete({ where: { id } });
  }

  trims(query: CatalogQueryDto) {
    return this.paginated((this.prisma as any).vehicleTrim, query);
  }

  async createTrim(dto: CreateCatalogItemDto) {
    if (!dto.modelId) throw new BadRequestException('modelId is required');

    await this.model(dto.modelId);

    return (this.prisma as any).vehicleTrim.create({
      data: {
        name: dto.name,
        modelId: dto.modelId,
      },
    });
  }

  trim(id: string) {
    return this.findOne((this.prisma as any).vehicleTrim, id, 'Vehicle trim');
  }

  async updateTrim(id: string, dto: UpdateCatalogItemDto) {
    await this.trim(id);
    return (this.prisma as any).vehicleTrim.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async deleteTrim(id: string) {
    await this.trim(id);
    return (this.prisma as any).vehicleTrim.delete({ where: { id } });
  }

  async catalogSummary() {
    const [brands, models, trims, categories, features, options] = await Promise.all([
      (this.prisma as any).vehicleBrand.count(),
      (this.prisma as any).vehicleModel.count(),
      (this.prisma as any).vehicleTrim.count(),
      (this.prisma as any).vehicleCategory.count(),
      (this.prisma as any).vehicleFeature.count(),
      (this.prisma as any).vehicleOption.count(),
    ]);

    return {
      brands,
      models,
      trims,
      categories,
      features,
      options,
      generatedAt: new Date().toISOString(),
    };
  }
}
