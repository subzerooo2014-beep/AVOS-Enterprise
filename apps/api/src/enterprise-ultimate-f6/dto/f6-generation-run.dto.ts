export class CreateF6GenerationRunDto {
  id!: string;
  blueprintCode!: string;
  status!: string;
  startedAt!: string;
  completedAt?: string;
}

export class UpdateF6GenerationRunDto {
  id?: string;
  blueprintCode?: string;
  status?: string;
  startedAt?: string;
  completedAt?: string;
}