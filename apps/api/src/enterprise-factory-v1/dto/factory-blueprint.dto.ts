export class CreateFactoryBlueprintDto {
  id!: string;
  code!: string;
  title!: string;
  version!: string;
  active!: boolean;
  definition?: Record<string, unknown>;
}

export class UpdateFactoryBlueprintDto {
  id?: string;
  code?: string;
  title?: string;
  version?: string;
  active?: boolean;
  definition?: Record<string, unknown>;
}