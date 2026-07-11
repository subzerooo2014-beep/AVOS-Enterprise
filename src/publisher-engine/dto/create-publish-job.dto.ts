import { IsArray, IsDateString, IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreatePublishJobDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  campaignId?: string;

  @IsOptional()
  @IsString()
  channelId?: string;

  @IsOptional()
  @IsIn(["low", "normal", "high", "urgent"])
  priority?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  maxRetries?: number;

  @IsOptional()
  result?: any;
}

export class CreatePublishJobsBatchDto {
  @IsArray()
  items!: CreatePublishJobDto[];
}
