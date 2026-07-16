export class CreateFactoryV3JobLeaseDto {
  id!: string;
  jobId!: string;
  workerId!: string;
  expiresAt!: string;
  active!: boolean;
}

export class UpdateFactoryV3JobLeaseDto {
  id?: string;
  jobId?: string;
  workerId?: string;
  expiresAt?: string;
  active?: boolean;
}