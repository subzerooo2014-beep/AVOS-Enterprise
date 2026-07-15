import {
  IsBoolean,
  IsString,
} from 'class-validator';

export class ContainerDefinitionDto {
  @IsString()
  id!: string;

  @IsString()
  image!: string;

  @IsBoolean()
  healthcheck!: boolean;

  @IsBoolean()
  nonRootUser!: boolean;

  @IsBoolean()
  readOnlyFilesystem!: boolean;

  @IsString()
  cpuLimit!: string;

  @IsString()
  memoryLimit!: string;
}