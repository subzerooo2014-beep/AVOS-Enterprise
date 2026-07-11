import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class GovernanceActorDto {
  @IsString()
  @MaxLength(200)
  id!: string;

  @IsIn([
    "user",
    "service",
    "system",
    "automation",
  ])
  type!:
    | "user"
    | "service"
    | "system"
    | "automation";

  @IsOptional()
  @IsString()
  @MaxLength(300)
  name?: string;

  @IsArray()
  @IsString({ each: true })
  roles!: string[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  ipAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  userAgent?: string;
}
