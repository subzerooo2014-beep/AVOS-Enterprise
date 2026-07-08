import { Module } from "@nestjs/common";
import { CustomerportalController } from "./customerportal.controller";
import { CustomerportalService } from "./customerportal.service";

@Module({
  controllers:[CustomerportalController],
  providers:[CustomerportalService],
})
export class CustomerportalModule{}
