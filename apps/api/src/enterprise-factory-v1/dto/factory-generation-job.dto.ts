export class CreateFactoryGenerationJobDto {
  id!: string;
  blueprintCode!: string;
  status!: string;
  priority!: number;
  createdAt!: string;
  completedAt?: string;
}

export class UpdateFactoryGenerationJobDto {
  id?: string;
  blueprintCode?: string;
  status?: string;
  priority?: number;
  createdAt?: string;
  completedAt?: string;
}