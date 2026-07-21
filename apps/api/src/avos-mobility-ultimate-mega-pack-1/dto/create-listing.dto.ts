import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateListingDto {
  @IsString()
  vehicleId!: string;

  @IsIn(['private', 'dealer', 'fleet', 'government'])
  sellerType!: 'private' | 'dealer' | 'fleet' | 'government';

  @IsString()
  sellerId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}