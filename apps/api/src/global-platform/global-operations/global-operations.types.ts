export type GlobalRegion =
  | "MIDDLE_EAST"
  | "EUROPE"
  | "NORTH_AMERICA"
  | "ASIA_PACIFIC"
  | "AFRICA"
  | "SOUTH_AMERICA";

export type TenantStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "PROVISIONING"
  | "ARCHIVED";

export interface CountryConfiguration {
  countryCode: string;
  name: string;
  region: GlobalRegion;
  defaultLanguage: string;
  supportedLanguages: string[];
  defaultCurrency: string;
  supportedCurrencies: string[];
  timezone: string;
  complianceProfile: string;
  enabled: boolean;
}

export interface GlobalTenant {
  id: string;
  name: string;
  countryCode: string;
  region: GlobalRegion;
  status: TenantStatus;
  dataResidencyRegion: GlobalRegion;
  defaultLanguage: string;
  defaultCurrency: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}

export interface RegionRuntime {
  region: GlobalRegion;
  active: boolean;
  primary: boolean;
  healthy: boolean;
  replicationEnabled: boolean;
  trafficWeight: number;
  latencyMs: number;
  updatedAt: string;
}

export interface CurrencyConversionRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
}

export interface CurrencyConversionResult {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  convertedAmount: number;
  timestamp: string;
}

export interface GlobalPlatformHealth {
  system: "AVOS Global Platform";
  component: "Global Operations Runtime";
  status: "HEALTHY" | "DEGRADED" | "BLOCKED";
  countries: number;
  tenants: number;
  activeRegions: number;
  healthyRegions: number;
  supportedLanguages: number;
  supportedCurrencies: number;
  generatedAt: string;
}