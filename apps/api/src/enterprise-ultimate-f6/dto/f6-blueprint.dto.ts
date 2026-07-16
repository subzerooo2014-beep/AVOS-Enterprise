export class CreateF6BlueprintDto {
  id!: string;
  code!: string;
  title!: string;
  version!: string;
  metadata?: Record<string, unknown>;
}

export class UpdateF6BlueprintDto {
  id?: string;
  code?: string;
  title?: string;
  version?: string;
  metadata?: Record<string, unknown>;
}