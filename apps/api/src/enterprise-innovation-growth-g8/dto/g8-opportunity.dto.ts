export class CreateG8OpportunityDto {
  id!: string;
  marketCode!: string;
  opportunityType!: string;
  confidence!: number;
  approved!: boolean;
}

export class UpdateG8OpportunityDto {
  id?: string;
  marketCode?: string;
  opportunityType?: string;
  confidence?: number;
  approved?: boolean;
}