import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class RollbackPolicyDto {
  @IsInt()
  @Min(1)
  version!: number;

  @IsString()
  @MaxLength(1000)
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  changedBy?: string;
}
