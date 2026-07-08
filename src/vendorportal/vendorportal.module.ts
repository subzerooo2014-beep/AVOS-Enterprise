import { Module } from "@nestjs/common";
import { VendorportalController } from "./vendorportal.controller";
import { VendorportalService } from "./vendorportal.service";

@Module({
  controllers:[VendorportalController],
  providers:[VendorportalService],
})
export class VendorportalModule{}
