import { IsOptional, IsString } from "class-validator";

export class CreateModelDto {
  @IsString()
  brandId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  bodyType?: string;
}
