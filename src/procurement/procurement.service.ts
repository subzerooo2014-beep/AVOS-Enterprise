import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './create-supplier.dto';
import { UpdateSupplierDto } from './update-supplier.dto';
import { CreatePurchaseOrderDto } from './create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './update-purchase-order.dto';
import { PurchaseOrderStatus, SupplierStatus } from './procurement.enums';

@Injectable()
export class ProcurementService {
  constructor(private readonly prisma: PrismaService) {}

  async createSupplier(dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        status: dto.status ?? SupplierStatus.ACTIVE,
      },
    });
  }

  async findSuppliers() {
    return this.prisma.supplier.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findSupplier(id: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async updateSupplier(id: string, dto: UpdateSupplierDto) {
    await this.findSupplier(id);
    return this.prisma.supplier.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSupplier(id: string) {
    await this.findSupplier(id);
    return this.prisma.supplier.delete({ where: { id } });
  }

  async createPurchaseOrder(dto: CreatePurchaseOrderDto) {
    await this.findSupplier(dto.supplierId);

    const total = dto.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    return this.prisma.purchaseOrder.create({
      data: {
        supplierId: dto.supplierId,
        status: dto.status ?? PurchaseOrderStatus.DRAFT,
        total,
        items: {
          create: dto.items.map((item) => ({
            itemName: item.itemName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { supplier: true, items: true },
    });
  }

  async findPurchaseOrders() {
    return this.prisma.purchaseOrder.findMany({
      include: { supplier: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPurchaseOrder(id: string) {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { supplier: true, items: true },
    });

    if (!order) throw new NotFoundException('Purchase order not found');
    return order;
  }

  async updatePurchaseOrder(id: string, dto: UpdatePurchaseOrderDto) {
    await this.findPurchaseOrder(id);

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: dto,
      include: { supplier: true, items: true },
    });
  }

  async deletePurchaseOrder(id: string) {
    await this.findPurchaseOrder(id);
    return this.prisma.purchaseOrder.delete({ where: { id } });
  }
}
