export class CreateG7KnowledgeNodeDto {
  id!: string;
  nodeType!: string;
  title!: string;
  content?: Record<string, unknown>;
  active!: boolean;
}

export class UpdateG7KnowledgeNodeDto {
  id?: string;
  nodeType?: string;
  title?: string;
  content?: Record<string, unknown>;
  active?: boolean;
}