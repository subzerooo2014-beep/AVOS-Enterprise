import {
  IsIn,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  id!: string;

  @IsString()
  listingId!: string;

  @IsString()
  sellerId!: string;

  @IsNumber()
  @Min(0)
  startPrice!: number;

  @IsNumber()
  @Min(0)
  reservePrice!: number;

  @IsString()
  currency!: string;

  @IsString()
  startsAt!: string;

  @IsString()
  endsAt!: string;

  @IsIn(['draft', 'scheduled', 'live', 'ended', 'settled', 'cancelled'])
  status!: 'draft' | 'scheduled' | 'live' | 'ended' | 'settled' | 'cancelled';
}