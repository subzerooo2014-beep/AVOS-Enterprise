import { IsEnum, IsOptional } from 'class-validator';
import { PurchaseOrderStatus } from './procurement.enums';

export class UpdatePurchaseOrderDto {
  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus;
}
