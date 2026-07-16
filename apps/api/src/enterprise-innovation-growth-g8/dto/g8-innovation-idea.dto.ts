export class CreateG8InnovationIdeaDto {
  id!: string;
  title!: string;
  category!: string;
  score!: number;
  metadata?: Record<string, unknown>;
}

export class UpdateG8InnovationIdeaDto {
  id?: string;
  title?: string;
  category?: string;
  score?: number;
  metadata?: Record<string, unknown>;
}