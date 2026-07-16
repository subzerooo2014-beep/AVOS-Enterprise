export class CreateUniversalCustomerProfileDto {
  id!: string;
  code!: string;
  status!: string;
  active!: boolean;
  score?: number;
  createdAt!: string;
  metadata?: Record<string, unknown>;
}

export class UpdateUniversalCustomerProfileDto {
  id?: string;
  code?: string;
  status?: string;
  active?: boolean;
  score?: number;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}