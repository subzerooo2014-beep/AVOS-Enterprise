export class CreateG4CustomerProfileDto {
  id!: string;
  customerId!: string;
  segment!: string;
  lifetimeValue?: number;
  traits?: Record<string, unknown>;
}

export class UpdateG4CustomerProfileDto {
  id?: string;
  customerId?: string;
  segment?: string;
  lifetimeValue?: number;
  traits?: Record<string, unknown>;
}