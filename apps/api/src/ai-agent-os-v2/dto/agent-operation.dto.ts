import { IsObject, IsOptional, IsString } from 'class-validator';

export class AgentOperationDto {
  @IsString()
  capability!: string;

  @IsString()
  action!: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}