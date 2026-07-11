import { Controller, Get, Param, Post } from "@nestjs/common";
import { PublishJobsService } from "./publish-jobs.service";

@Controller("publish-jobs")
export class PublishJobsController {
  constructor(private readonly service: PublishJobsService) {}

  @Get()
  all() {
    return this.service.all();
  }

  @Get("vehicle/:vehicleId")
  forVehicle(@Param("vehicleId") vehicleId: string) {
    return this.service.forVehicle(vehicleId);
  }

  @Post("test/:vehicleId")
  test(@Param("vehicleId") vehicleId: string) {
    return this.service.create(vehicleId);
  }
}
