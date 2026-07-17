
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, Min } from "class-validator";
import type { MemoryKind } from "../contracts/enterprise-memory.contracts";

export class CreateMemoryDto {
  @IsIn(["operational","working","semantic","episodic","decision","experience","long-term"])
  kind!: MemoryKind;

  @IsString() @IsNotEmpty()
  key!: string;

  @IsString() @IsNotEmpty()
  title!: string;

  @IsObject()
  content!: Record<string, unknown>;

  @IsString() @IsNotEmpty()
  source!: string;

  @IsOptional() @IsNumber() @Min(0) @Max(100)
  trustScore?: number;

  @IsOptional() @IsIn(["session","short","long","permanent"])
  retention?: "session" | "short" | "long" | "permanent";

  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[];
}

export class SearchMemoryDto {
  @IsString() @IsNotEmpty()
  query!: string;

  @IsOptional()
  @IsIn(["operational","working","semantic","episodic","decision","experience","long-term"])
  kind?: MemoryKind;
}