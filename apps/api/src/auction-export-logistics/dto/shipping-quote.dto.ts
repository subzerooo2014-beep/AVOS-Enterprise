import {
  IsIn,
  IsInt,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class ShippingQuoteDto {
  @IsString()
  id!: string;

  @IsString()
  carrierId!: string;

  @IsString()
  listingId!: string;

  @IsString()
  originPort!: string;

  @IsString()
  destinationPort!: string;

  @IsIn(['container', 'roro', 'air'])
  mode!: 'container' | 'roro' | 'air';

  @IsNumber()
  @Min(0)
  freightAmount!: number;

  @IsNumber()
  @Min(0)
  insuranceAmount!: number;

  @IsNumber()
  @Min(0)
  handlingAmount!: number;

  @IsString()
  currency!: string;

  @IsInt()
  @Min(1)
  transitDays!: number;
}