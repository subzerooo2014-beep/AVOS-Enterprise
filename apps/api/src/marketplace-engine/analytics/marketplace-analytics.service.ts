import { Injectable } from "@nestjs/common";

@Injectable()
export class MarketplaceAnalyticsService{
  dashboard(){
    return{
      listings:0,
      views:0,
      leads:0,
      conversions:0,
      revenue:0,
    };
  }
}
