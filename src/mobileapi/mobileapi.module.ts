import { Module } from "@nestjs/common";
import { MobileapiController } from "./mobileapi.controller";
import { MobileapiService } from "./mobileapi.service";

@Module({
  controllers:[MobileapiController],
  providers:[MobileapiService],
})
export class MobileapiModule{}
