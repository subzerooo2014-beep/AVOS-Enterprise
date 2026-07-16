export class CreateArchitectureStandardDto {
  id!: string;
  code!: string;
  status!: string;
  active!: boolean;
  score?: number;
  createdAt!: string;
  metadata?: Record<string, unknown>;
}

export class UpdateArchitectureStandardDto {
  id?: string;
  code?: string;
  status?: string;
  active?: boolean;
  score?: number;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}