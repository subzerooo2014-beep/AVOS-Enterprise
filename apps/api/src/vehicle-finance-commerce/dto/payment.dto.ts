import {
  IsIn,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  id!: string;

  @IsString()
  orderId!: string;

  @IsString()
  buyerId!: string;

  @IsString()
  sellerId!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsString()
  currency!: string;

  @IsIn(['card', 'bank-transfer', 'wallet', 'cash'])
  method!: 'card' | 'bank-transfer' | 'wallet' | 'cash';
}