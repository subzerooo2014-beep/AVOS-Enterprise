import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { CreateListingDto } from './dto/create-listing.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { DealerService } from './dealer.service';
import { ListingService } from './listing.service';
import { MobilityAiService } from './mobility-ai.service';
import { MobilityAuditService } from './mobility-audit.service';
import { MobilityCapabilityRegistryService } from './mobility-capability-registry.service';
import { MobilityGlobalizationService } from './mobility-globalization.service';
import { MobilityLaunchService } from './mobility-launch.service';
import { MobilityReadinessService } from './mobility-readiness.service';
import { VehicleService } from './vehicle.service';

@Controller('avos/mobility')
export class MobilityController {
  constructor(
    private readonly launch: MobilityLaunchService,
    private readonly readiness: MobilityReadinessService,
    private readonly vehicles: VehicleService,
    private readonly dealers: DealerService,
    private readonly listings: ListingService,
    private readonly ai: MobilityAiService,
    private readonly capabilities: MobilityCapabilityRegistryService,
    private readonly globalization: MobilityGlobalizationService,
    private readonly audit: MobilityAuditService,
  ) {}

  @Get('ultimate-mega-pack-1/status')
  status() {
    return this.launch.status();
  }

  @Get('ultimate-mega-pack-1/readiness')
  readinessStatus() {
    return this.readiness.evaluate();
  }

  @Get('capabilities')
  listCapabilities() {
    return this.capabilities.list();
  }

  @Get('markets')
  listMarkets() {
    return this.globalization.listMarkets();
  }

  @Get('context')
  resolveContext(
    @Query('countryCode') countryCode?: string,
    @Query('language') language?: string,
    @Query('currency') currency?: string,
  ) {
    return this.globalization.resolve(countryCode, language, currency);
  }

  @Post('vehicles')
  createVehicle(@Body() dto: CreateVehicleDto) {
    return this.vehicles.create(dto);
  }

  @Get('vehicles')
  searchVehicles(
    @Query('q') q?: string,
    @Query('make') make?: string,
    @Query('model') model?: string,
    @Query('minYear') minYear?: string,
    @Query('maxYear') maxYear?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('countryCode') countryCode?: string,
    @Query('city') city?: string,
    @Query('dealerId') dealerId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.vehicles.search({
      q,
      make,
      model,
      minYear: minYear ? Number(minYear) : undefined,
      maxYear: maxYear ? Number(maxYear) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      countryCode,
      city,
      dealerId,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('vehicles/:id')
  getVehicle(@Param('id') id: string) {
    return this.vehicles.findById(id);
  }

  @Post('dealers')
  createDealer(@Body() dto: CreateDealerDto) {
    return this.dealers.create(dto);
  }

  @Get('dealers')
  listDealers() {
    return this.dealers.list();
  }

  @Post('listings')
  createListing(@Body() dto: CreateListingDto) {
    return this.listings.create(dto);
  }

  @Get('listings')
  listListings(@Query('status') status?: string) {
    return this.listings.list(status);
  }

  @Post('listings/:id/publish')
  publishListing(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.listings.publish(id, body.approvedBy);
  }

  @Post('ai/price-assessment')
  priceAssessment(@Body() body: Record<string, unknown>) {
    return this.ai.assessPrice(body);
  }

  @Post('ai/recommendations')
  async recommendations(
    @Body()
    body: {
      make?: string;
      maxPrice?: number;
      countryCode?: string;
    },
  ) {
    const vehicles = await this.vehicles.search({
      countryCode: body.countryCode,
      limit: 200,
    });
    return this.ai.recommend(vehicles, body);
  }

  @Get('ai/status')
  aiStatus() {
    return this.ai.getStatus();
  }

  @Get('audit')
  auditLog(@Query('limit') limit?: string) {
    return this.audit.list(limit ? Number(limit) : 100);
  }
}