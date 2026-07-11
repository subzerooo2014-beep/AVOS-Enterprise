import { IsOptional, IsString } from 'class-validator';

export class UpdateCatalogItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
