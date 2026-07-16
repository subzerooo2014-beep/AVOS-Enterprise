export class CreateG4RetentionActionDto {
  id!: string;
  customerId!: string;
  actionType!: string;
  priority!: number;
  executed!: boolean;
}

export class UpdateG4RetentionActionDto {
  id?: string;
  customerId?: string;
  actionType?: string;
  priority?: number;
  executed?: boolean;
}