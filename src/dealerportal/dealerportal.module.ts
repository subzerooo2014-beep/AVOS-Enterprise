import { Module } from "@nestjs/common";
import { DealerportalController } from "./dealerportal.controller";
import { DealerportalService } from "./dealerportal.service";

@Module({
  controllers:[DealerportalController],
  providers:[DealerportalService],
})
export class DealerportalModule{}
