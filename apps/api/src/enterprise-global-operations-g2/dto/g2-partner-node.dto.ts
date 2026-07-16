export class CreateG2PartnerNodeDto {
  id!: string;
  partnerType!: string;
  countryCode!: string;
  active!: boolean;
  capabilities?: Record<string, unknown>;
}

export class UpdateG2PartnerNodeDto {
  id?: string;
  partnerType?: string;
  countryCode?: string;
  active?: boolean;
  capabilities?: Record<string, unknown>;
}