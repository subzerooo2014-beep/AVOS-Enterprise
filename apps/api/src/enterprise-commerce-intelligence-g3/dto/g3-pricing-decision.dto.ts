export class CreateG3PricingDecisionDto {
  id!: string;
  entityId!: string;
  price!: number;
  approved!: boolean;
  createdAt!: string;
}

export class UpdateG3PricingDecisionDto {
  id?: string;
  entityId?: string;
  price?: number;
  approved?: boolean;
  createdAt?: string;
}