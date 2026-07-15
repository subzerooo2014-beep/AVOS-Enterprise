import {
  IsBoolean,
  IsString,
} from 'class-validator';

export class DeploymentPipelineDto {
  @IsString()
  id!: string;

  @IsBoolean()
  build!: boolean;

  @IsBoolean()
  test!: boolean;

  @IsBoolean()
  securityScan!: boolean;

  @IsBoolean()
  artifactPublish!: boolean;

  @IsBoolean()
  stagingDeploy!: boolean;

  @IsBoolean()
  productionApproval!: boolean;

  @IsBoolean()
  productionDeploy!: boolean;

  @IsBoolean()
  rollback!: boolean;
}