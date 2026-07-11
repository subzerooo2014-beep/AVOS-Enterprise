export class CreateRetentionPolicyDto {
  assetId!: string;
  name!: string;
  retentionDays!: number;
  legalHoldEnabled?: boolean;
  deletionEnabled?: boolean;
  createdBy?: string;
}
