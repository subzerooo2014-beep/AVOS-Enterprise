export class CreateG9PartnerRelationDto {
  id!: string;
  sourcePartnerId!: string;
  targetPartnerId!: string;
  relationType!: string;
  strength!: number;
}

export class UpdateG9PartnerRelationDto {
  id?: string;
  sourcePartnerId?: string;
  targetPartnerId?: string;
  relationType?: string;
  strength?: number;
}