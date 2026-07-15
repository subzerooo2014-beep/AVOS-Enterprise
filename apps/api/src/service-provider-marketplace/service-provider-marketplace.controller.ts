import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServiceBookingDto } from './dto/service-booking.dto';
import { ServiceQuoteDto } from './dto/service-quote.dto';
import { ProviderProfileDto } from './dto/provider-profile.dto';
import { ServiceBookingEngineService } from './service-booking-engine.service';
import { ServicePricingQuotationEngineService } from './service-pricing-quotation-engine.service';
import { WorkshopProviderProfileEngineService } from './workshop-provider-profile-engine.service';
import { ServiceMarketplaceDashboardService } from './service-marketplace-dashboard.service';
import { SERVICE_PROVIDER_MARKETPLACE_CAPABILITIES } from './service-provider-marketplace.types';

@Controller('service-provider-marketplace')
export class ServiceProviderMarketplaceController {
  constructor(
    private readonly bookings: ServiceBookingEngineService,
    private readonly quotations: ServicePricingQuotationEngineService,
    private readonly providers: WorkshopProviderProfileEngineService,
    private readonly dashboard: ServiceMarketplaceDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle T — Services, Workshops & Provider Marketplace',
      count: SERVICE_PROVIDER_MARKETPLACE_CAPABILITIES.length,
      capabilities: SERVICE_PROVIDER_MARKETPLACE_CAPABILITIES,
    };
  }

  @Post('bookings')
  createBooking(@Body() input: ServiceBookingDto) {
    return this.bookings.create(input);
  }

  @Post('quotes/calculate')
  calculateQuote(@Body() input: ServiceQuoteDto) {
    return this.quotations.calculate(input);
  }

  @Post('providers/rank')
  rankProviders(@Body() input: { providers: ProviderProfileDto[] }) {
    return this.providers.rank(input.providers);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}