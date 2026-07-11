export class CreateAccessReviewDto {
  assetId!: string;
  principal!: string;
  role!: string;
  businessJustification!: string;
  expiresAt?: string;
}
