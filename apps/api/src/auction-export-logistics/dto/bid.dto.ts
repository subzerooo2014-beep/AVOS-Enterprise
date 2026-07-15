import {
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class PlaceBidDto {
  @IsString()
  id!: string;

  @IsString()
  auctionId!: string;

  @IsString()
  bidderId!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsString()
  currency!: string;

  @IsString()
  placedAt!: string;
}