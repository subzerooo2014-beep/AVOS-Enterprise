import { IsBoolean, IsInt, IsObject, IsOptional, IsString, Max, Min } from "class-validator";
import { SupportedLanguage } from "../types/ultimate.types";

export class EnqueueJobDto {
  @IsString() type!: string;
  @IsObject() payload!: Record<string, unknown>;
  @IsOptional() @IsInt() @Min(0) @Max(100) priority?: number;
  @IsOptional() @IsInt() @Min(1) @Max(20) maxAttempts?: number;
  @IsOptional() @IsInt() @Min(0) delayMs?: number;
}

export class GenerateDto {
  @IsObject() blueprint!: Record<string, unknown>;
  @IsOptional() @IsBoolean() materialize?: boolean;
}

export class ArchitectDto {
  @IsString() objective!: string;
  @IsOptional() @IsString() preferredLanguage?: SupportedLanguage;
  @IsOptional() @IsString() preferredFramework?: string;
  @IsOptional() @IsObject() constraints?: Record<string, unknown>;
}

export class HumanDecisionDto {
  @IsString() approvedBy!: string;
  @IsOptional() @IsString() reason?: string;
}

export class CertifyDto {
  @IsString() approvedBy!: string;
}
