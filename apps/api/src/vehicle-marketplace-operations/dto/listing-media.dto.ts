import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListingMediaItemDto {
  @IsString()
  id!: string;

  @IsString()
  listingId!: string;

  @IsIn(['image', 'video', 'document'])
  type!: 'image' | 'video' | 'document';

  @IsString()
  url!: string;

  @IsInt()
  @Min(0)
  order!: number;

  @IsBoolean()
  isCover!: boolean;

  @IsOptional()
  @IsString()
  checksum?: string;
}

export class ListingMediaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListingMediaItemDto)
  media!: ListingMediaItemDto[];
}