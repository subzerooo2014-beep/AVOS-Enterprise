import {
  IsArray,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SyncRecordDto {
  @IsString()
  id!: string;

  @IsString()
  sourceSystem!: string;

  @IsString()
  targetSystem!: string;

  @IsString()
  entity!: string;

  @IsInt()
  @Min(0)
  sourceVersion!: number;

  @IsInt()
  @Min(0)
  targetVersion!: number;

  @IsString()
  lastSynchronizedAt!: string;
}

export class SynchronizationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncRecordDto)
  records!: SyncRecordDto[];
}