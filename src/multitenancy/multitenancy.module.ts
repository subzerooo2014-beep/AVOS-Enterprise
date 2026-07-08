import { Module } from "@nestjs/common";
import { MultitenancyController } from "./multitenancy.controller";
import { MultitenancyService } from "./multitenancy.service";

@Module({
 controllers:[MultitenancyController],
 providers:[MultitenancyService],
})
export class MultitenancyModule{}
