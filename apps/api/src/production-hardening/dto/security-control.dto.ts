import {
  IsArray,
  IsBoolean,
  IsString,
} from 'class-validator';

export class SecurityControlDto {
  @IsString()
  id!: string;

  @IsString()
  category!: string;

  @IsBoolean()
  required!: boolean;

  @IsBoolean()
  enabled!: boolean;

  @IsArray()
  @IsString({ each: true })
  evidence!: string[];
}