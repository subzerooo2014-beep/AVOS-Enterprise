import { BadRequestException, NotFoundException } from '@nestjs/common';

export type SaleStatus =
  | 'OPEN'
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'WON'
  | 'LOST'
  | 'CANCELLED'
  | 'CLOSED';

export class SalesPolicy {
  static ensureExists(sale: any): void {
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }
  }

  static ensureCanUpdate(sale: any): void {
    this.ensureExists(sale);

    if (['WON', 'LOST', 'CANCELLED', 'CLOSED'].includes(sale.status)) {
      throw new BadRequestException('Closed sales cannot be updated');
    }
  }

  static ensureCanDelete(sale: any): void {
    this.ensureExists(sale);

    if (['WON', 'CLOSED'].includes(sale.status)) {
      throw new BadRequestException('Won or closed sales cannot be deleted');
    }
  }

  static ensureValidStatus(status: SaleStatus): void {
    const allowed = ['OPEN', 'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'WON', 'LOST', 'CANCELLED', 'CLOSED'];

    if (!allowed.includes(status)) {
      throw new BadRequestException('Invalid sales status');
    }
  }
}
