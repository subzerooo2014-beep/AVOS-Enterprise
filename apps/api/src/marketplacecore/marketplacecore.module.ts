import { Module } from "@nestjs/common";
import { MarketplacecoreController } from "./marketplacecore.controller";
import { MarketplacecoreService } from "./marketplacecore.service";

@Module({
 controllers:[MarketplacecoreController],
 providers:[MarketplacecoreService],
})
export class MarketplacecoreModule{}
