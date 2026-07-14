import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class KnowledgeEntityDto {
  @IsString()
  id!: string;

  @IsString()
  type!: string;

  @IsString()
  label!: string;

  @IsString()
  domain!: string;

  @IsNumber()
  @Min(0)
  confidence!: number;

  @IsObject()
  attributes!: Record<string, string | number | boolean>;
}

export class KnowledgeRelationDto {
  @IsString()
  id!: string;

  @IsString()
  from!: string;

  @IsString()
  to!: string;

  @IsString()
  relation!: string;

  @IsNumber()
  @Min(0)
  weight!: number;
}

export class KnowledgeGraphDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KnowledgeEntityDto)
  entities!: KnowledgeEntityDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KnowledgeRelationDto)
  relations!: KnowledgeRelationDto[];
}