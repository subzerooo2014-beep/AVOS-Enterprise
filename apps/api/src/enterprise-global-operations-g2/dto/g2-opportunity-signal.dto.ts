export class CreateG2OpportunitySignalDto {
  id!: string;
  marketCode!: string;
  category!: string;
  confidence!: number;
  createdAt!: string;
}

export class UpdateG2OpportunitySignalDto {
  id?: string;
  marketCode?: string;
  category?: string;
  confidence?: number;
  createdAt?: string;
}