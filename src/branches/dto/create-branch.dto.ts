import { IsOptional, IsString } from "class-validator";

export class CreateBranchDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsString()
  organizationId!: string;
}
