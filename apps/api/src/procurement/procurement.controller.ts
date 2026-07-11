import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { CreateSupplierDto } from './create-supplier.dto';
import { UpdateSupplierDto } from './update-supplier.dto';
import { CreatePurchaseOrderDto } from './create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './update-purchase-order.dto';

@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Post('suppliers')
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.procurementService.createSupplier(dto);
  }

  @Get('suppliers')
  findSuppliers() {
    return this.procurementService.findSuppliers();
  }

  @Get('suppliers/:id')
  findSupplier(@Param('id') id: string) {
    return this.procurementService.findSupplier(id);
  }

  @Patch('suppliers/:id')
  updateSupplier(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.procurementService.updateSupplier(id, dto);
  }

  @Delete('suppliers/:id')
  deleteSupplier(@Param('id') id: string) {
    return this.procurementService.deleteSupplier(id);
  }

  @Post('purchase-orders')
  createPurchaseOrder(@Body() dto: CreatePurchaseOrderDto) {
    return this.procurementService.createPurchaseOrder(dto);
  }

  @Get('purchase-orders')
  findPurchaseOrders() {
    return this.procurementService.findPurchaseOrders();
  }

  @Get('purchase-orders/:id')
  findPurchaseOrder(@Param('id') id: string) {
    return this.procurementService.findPurchaseOrder(id);
  }

  @Patch('purchase-orders/:id')
  updatePurchaseOrder(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderDto) {
    return this.procurementService.updatePurchaseOrder(id, dto);
  }

  @Delete('purchase-orders/:id')
  deletePurchaseOrder(@Param('id') id: string) {
    return this.procurementService.deletePurchaseOrder(id);
  }
}
