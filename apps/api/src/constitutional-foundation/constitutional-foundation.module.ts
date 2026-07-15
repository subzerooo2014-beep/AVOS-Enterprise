import { Module } from "@nestjs/common";
import { ConstitutionalFoundationController } from "./constitutional-foundation.controller";
import { ConstitutionalFoundationService } from "./constitutional-foundation.service";

@Module({
  controllers: [ConstitutionalFoundationController],
  providers: [ConstitutionalFoundationService],
  exports: [ConstitutionalFoundationService],
})
export class ConstitutionalFoundationModule {}