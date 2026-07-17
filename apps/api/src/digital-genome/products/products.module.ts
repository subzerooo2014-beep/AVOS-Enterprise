import { Module } from "@nestjs/common";
import { DigitalGenomeProductsController } from "./products.controller";
import { DigitalGenomeProductsService } from "./products.service";

@Module({
  controllers: [DigitalGenomeProductsController],
  providers: [DigitalGenomeProductsService],
  exports: [DigitalGenomeProductsService],
})
export class DigitalGenomeProductsModule {}