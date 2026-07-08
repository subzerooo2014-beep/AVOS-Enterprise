import { IsOptional, IsString } from 'class-validator';

export class CreateCatalogItemDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsString()
  modelId?: string;
}
