import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  CountryConfiguration,
  CurrencyConversionRequest,
  CurrencyConversionResult,
  GlobalPlatformHealth,
  GlobalRegion,
  GlobalTenant,
  RegionRuntime,
} from "./global-operations.types";

@Injectable()
export class GlobalOperationsService {
  private readonly countries = new Map<string, CountryConfiguration>();
  private readonly tenants = new Map<string, GlobalTenant>();
  private readonly regions = new Map<GlobalRegion, RegionRuntime>();

  constructor() {
    this.seedRegions();
    this.seedUae();
  }

  registerCountry(
    configuration: CountryConfiguration,
  ): CountryConfiguration {
    const countryCode = configuration.countryCode.trim().toUpperCase();

    if (!countryCode) {
      throw new Error("countryCode is required");
    }

    const stored: CountryConfiguration = {
      ...configuration,
      countryCode,
      supportedLanguages: [...new Set(configuration.supportedLanguages)],
      supportedCurrencies: [...new Set(configuration.supportedCurrencies)],
    };

    this.countries.set(countryCode, stored);
    return this.cloneCountry(stored);
  }

  listCountries(): CountryConfiguration[] {
    return Array.from(this.countries.values()).map((item) =>
      this.cloneCountry(item),
    );
  }

  getCountry(countryCode: string): CountryConfiguration {
    const country = this.countries.get(countryCode.trim().toUpperCase());

    if (!country) {
      throw new Error(`Country configuration not found: ${countryCode}`);
    }

    return this.cloneCountry(country);
  }

  createTenant(
    input: Omit<GlobalTenant, "id" | "createdAt" | "updatedAt">,
  ): GlobalTenant {
    const country = this.getCountry(input.countryCode);
    const now = new Date().toISOString();

    const tenant: GlobalTenant = {
      ...input,
      id: randomUUID(),
      countryCode: country.countryCode,
      region: country.region,
      dataResidencyRegion: input.dataResidencyRegion ?? country.region,
      createdAt: now,
      updatedAt: now,
      metadata: { ...input.metadata },
    };

    this.tenants.set(tenant.id, tenant);
    return this.cloneTenant(tenant);
  }

  listTenants(): GlobalTenant[] {
    return Array.from(this.tenants.values()).map((item) =>
      this.cloneTenant(item),
    );
  }

  updateRegion(
    region: GlobalRegion,
    patch: Partial<RegionRuntime>,
  ): RegionRuntime {
    const current = this.regions.get(region);

    if (!current) {
      throw new Error(`Region runtime not found: ${region}`);
    }

    const updated: RegionRuntime = {
      ...current,
      ...patch,
      region,
      updatedAt: new Date().toISOString(),
    };

    this.regions.set(region, updated);
    return { ...updated };
  }

  listRegions(): RegionRuntime[] {
    return Array.from(this.regions.values()).map((item) => ({ ...item }));
  }

  convertCurrency(
    request: CurrencyConversionRequest,
  ): CurrencyConversionResult {
    if (!Number.isFinite(request.amount) || request.amount < 0) {
      throw new Error("amount must be zero or greater");
    }

    if (!Number.isFinite(request.rate) || request.rate <= 0) {
      throw new Error("rate must be greater than zero");
    }

    return {
      ...request,
      convertedAmount: Number(
        (request.amount * request.rate).toFixed(2),
      ),
      timestamp: new Date().toISOString(),
    };
  }

  resolveLocale(
    countryCode: string,
    requestedLanguage?: string,
    requestedCurrency?: string,
  ) {
    const country = this.getCountry(countryCode);

    const language =
      requestedLanguage &&
      country.supportedLanguages.includes(requestedLanguage)
        ? requestedLanguage
        : country.defaultLanguage;

    const currency =
      requestedCurrency &&
      country.supportedCurrencies.includes(requestedCurrency)
        ? requestedCurrency
        : country.defaultCurrency;

    return {
      countryCode: country.countryCode,
      region: country.region,
      language,
      currency,
      timezone: country.timezone,
      complianceProfile: country.complianceProfile,
    };
  }

  getHealth(): GlobalPlatformHealth {
    const countries = this.listCountries();
    const tenants = this.listTenants();
    const regions = this.listRegions();
    const activeRegions = regions.filter((item) => item.active).length;
    const healthyRegions = regions.filter(
      (item) => item.active && item.healthy,
    ).length;

    const languages = new Set(
      countries.flatMap((country) => country.supportedLanguages),
    );

    const currencies = new Set(
      countries.flatMap((country) => country.supportedCurrencies),
    );

    const status =
      activeRegions === 0
        ? "BLOCKED"
        : healthyRegions < activeRegions
          ? "DEGRADED"
          : "HEALTHY";

    return {
      system: "AVOS Global Platform",
      component: "Global Operations Runtime",
      status,
      countries: countries.length,
      tenants: tenants.length,
      activeRegions,
      healthyRegions,
      supportedLanguages: languages.size,
      supportedCurrencies: currencies.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private seedRegions(): void {
    const regions: GlobalRegion[] = [
      "MIDDLE_EAST",
      "EUROPE",
      "NORTH_AMERICA",
      "ASIA_PACIFIC",
      "AFRICA",
      "SOUTH_AMERICA",
    ];

    for (const region of regions) {
      this.regions.set(region, {
        region,
        active: region === "MIDDLE_EAST",
        primary: region === "MIDDLE_EAST",
        healthy: true,
        replicationEnabled: region === "MIDDLE_EAST",
        trafficWeight: region === "MIDDLE_EAST" ? 100 : 0,
        latencyMs: 0,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  private seedUae(): void {
    this.registerCountry({
      countryCode: "AE",
      name: "United Arab Emirates",
      region: "MIDDLE_EAST",
      defaultLanguage: "ar-AE",
      supportedLanguages: ["ar-AE", "en-AE"],
      defaultCurrency: "AED",
      supportedCurrencies: ["AED", "USD"],
      timezone: "Asia/Dubai",
      complianceProfile: "UAE_PRODUCTION",
      enabled: true,
    });
  }

  private cloneCountry(
    item: CountryConfiguration,
  ): CountryConfiguration {
    return {
      ...item,
      supportedLanguages: [...item.supportedLanguages],
      supportedCurrencies: [...item.supportedCurrencies],
    };
  }

  private cloneTenant(item: GlobalTenant): GlobalTenant {
    return {
      ...item,
      metadata: { ...item.metadata },
    };
  }
}