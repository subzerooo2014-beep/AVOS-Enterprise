import { Module } from "@nestjs/common";
import { AdminportalController } from "./adminportal.controller";
import { AdminportalService } from "./adminportal.service";

@Module({
  controllers:[AdminportalController],
  providers:[AdminportalService],
})
export class AdminportalModule{}
