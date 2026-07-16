export interface G2PartnerNode {
  id: string;
  partnerType: string;
  countryCode: string;
  active: boolean;
  capabilities?: Record<string, unknown>;
}