import { Controller, Get, Query } from "@nestjs/common";
import { VehicleSearchService } from "./vehicle-search.service";
import { VehicleSearchDto } from "./dto/vehicle-search.dto";

@Controller("vehicle-search")
export class VehicleSearchController {
  constructor(private service: VehicleSearchService) {}

  @Get()
  search(@Query() dto: VehicleSearchDto) {
    return this.service.search(dto);
  }
}
