export class CreateFactoryV2ApprovalDto {
  id!: string;
  jobId!: string;
  status!: string;
  approvedBy?: string;
  approvedAt?: string;
}

export class UpdateFactoryV2ApprovalDto {
  id?: string;
  jobId?: string;
  status?: string;
  approvedBy?: string;
  approvedAt?: string;
}