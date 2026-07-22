import { Body,Controller,Get,Param,Post } from '@nestjs/common';
import { MobilityRuntimeService } from './mobility-runtime.service'; import { MobilityService } from './mobility.service'; import { VerificationService } from './verification.service'; import { CertificationService } from './certification.service'; import { DemoService } from './demo.service';
import { CreateVehicleDto,CreateCustomerDto,CreateListingDto,CreateReservationDto,CreatePurchaseRequestDto,PricingDto,RecommendationDto,CertificationDto } from './dto';
@Controller('avos/mobility')
export class MobilityController {
 constructor(private readonly runtime:MobilityRuntimeService,private readonly mobility:MobilityService,private readonly verification:VerificationService,private readonly certification:CertificationService,private readonly demo:DemoService){}
 @Get('status') status(){return this.runtime.status();} @Get('health') health(){return this.runtime.health();} @Post('verify') verify(){return this.verification.verify();} @Post('certification/certify') certify(@Body() d:CertificationDto){return this.certification.certify(d);} @Post('mvp/demo') runDemo(){return this.demo.run();} @Get('dashboard') dashboard(){return {runtime:this.runtime.health(),kpis:this.runtime.status().records,generatedAt:new Date().toISOString()};}
 @Get('vehicles') vehicles(){return this.mobility.all().vehicles;} @Get('vehicles/:id') vehicle(@Param('id') id:string){return this.mobility.vehicle(id);} @Post('vehicles') createVehicle(@Body() d:CreateVehicleDto){return this.mobility.createVehicle(d);}
 @Get('customers') customers(){return this.mobility.all().customers;} @Post('customers') createCustomer(@Body() d:CreateCustomerDto){return this.mobility.createCustomer(d);}
 @Get('marketplace/listings') listings(){return this.mobility.all().listings;} @Post('marketplace/listings') createListing(@Body() d:CreateListingDto){return this.mobility.createListing(d);}
 @Get('marketplace/reservations') reservations(){return this.mobility.all().reservations;} @Post('marketplace/reservations') createReservation(@Body() d:CreateReservationDto){return this.mobility.createReservation(d);}
 @Get('marketplace/purchase-requests') purchases(){return this.mobility.all().purchaseRequests;} @Post('marketplace/purchase-requests') createPurchase(@Body() d:CreatePurchaseRequestDto){return this.mobility.createPurchase(d);}
 @Post('intelligence/pricing/analyze') pricing(@Body() d:PricingDto){return this.mobility.pricing(d);} @Post('intelligence/recommend') recommend(@Body() d:RecommendationDto){return this.mobility.recommend(d);}
}
