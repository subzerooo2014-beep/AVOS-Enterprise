import { Module } from "@nestjs/common";
import { BusinessProvidersController } from "./business-providers.controller";
import { BusinessProvidersService } from "./business-providers.service";

@Module({
  controllers: [BusinessProvidersController],
  providers: [BusinessProvidersService],
  exports: [BusinessProvidersService],
})
export class BusinessProvidersModule {}
