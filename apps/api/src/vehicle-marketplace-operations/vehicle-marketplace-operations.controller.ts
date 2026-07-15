import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingMediaDto } from './dto/listing-media.dto';
import { MarketplaceSearchDto } from './dto/marketplace-search.dto';
import { ListingLifecycleEngineService } from './listing-lifecycle-engine.service';
import { MarketplaceMediaManagerService } from './marketplace-media-manager.service';
import { MarketplaceSearchIndexService } from './marketplace-search-index.service';
import { MarketplaceOperationsDashboardService } from './marketplace-operations-dashboard.service';
import { VEHICLE_MARKETPLACE_OPERATIONS_CAPABILITIES } from './vehicle-marketplace-operations.types';

@Controller('vehicle-marketplace-operations')
export class VehicleMarketplaceOperationsController {
  constructor(
    private readonly lifecycle: ListingLifecycleEngineService,
    private readonly media: MarketplaceMediaManagerService,
    private readonly search: MarketplaceSearchIndexService,
    private readonly dashboard: MarketplaceOperationsDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle R — Vehicle Marketplace & Listing Operations',
      count: VEHICLE_MARKETPLACE_OPERATIONS_CAPABILITIES.length,
      capabilities: VEHICLE_MARKETPLACE_OPERATIONS_CAPABILITIES,
    };
  }

  @Post('listings')
  createListing(@Body() input: CreateListingDto) {
    return this.lifecycle.create(input);
  }

  @Post('media/organize')
  organizeMedia(@Body() input: ListingMediaDto) {
    return this.media.organize(input.media);
  }

  @Post('search')
  searchListings(@Body() input: MarketplaceSearchDto) {
    return this.search.search(input);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}