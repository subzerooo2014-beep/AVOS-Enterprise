import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { GlobalOperationsService } from "./global-operations.service";
import {
  CountryConfiguration,
  CurrencyConversionRequest,
  GlobalRegion,
  GlobalTenant,
  RegionRuntime,
} from "./global-operations.types";

@Controller("global-platform")
export class GlobalOperationsController {
  constructor(private readonly globalOperations: GlobalOperationsService) {}

  @Get("health")
  health() {
    return this.globalOperations.getHealth();
  }

  @Get("countries")
  countries() {
    return this.globalOperations.listCountries();
  }

  @Get("countries/:countryCode")
  country(@Param("countryCode") countryCode: string) {
    return this.globalOperations.getCountry(countryCode);
  }

  @Post("countries")
  registerCountry(@Body() configuration: CountryConfiguration) {
    return this.globalOperations.registerCountry(configuration);
  }

  @Get("tenants")
  tenants() {
    return this.globalOperations.listTenants();
  }

  @Post("tenants")
  createTenant(
    @Body()
    input: Omit<GlobalTenant, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.globalOperations.createTenant(input);
  }

  @Get("regions")
  regions() {
    return this.globalOperations.listRegions();
  }

  @Patch("regions/:region")
  updateRegion(
    @Param("region") region: GlobalRegion,
    @Body() patch: Partial<RegionRuntime>,
  ) {
    return this.globalOperations.updateRegion(region, patch);
  }

  @Post("currency/convert")
  convertCurrency(@Body() request: CurrencyConversionRequest) {
    return this.globalOperations.convertCurrency(request);
  }

  @Get("locale/:countryCode")
  resolveLocale(@Param("countryCode") countryCode: string) {
    return this.globalOperations.resolveLocale(countryCode);
  }
}