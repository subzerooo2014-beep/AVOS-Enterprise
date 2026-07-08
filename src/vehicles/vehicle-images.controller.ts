import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { VehicleImagesService } from "./vehicle-images.service";

@Controller("vehicles/:id/images")
export class VehicleImagesController {

  constructor(
    private readonly service: VehicleImagesService,
  ) {}

  @Get()
  list(@Param("id") id: string) {
    return this.service.list(id);
  }

  @Post()
  add(
    @Param("id") id: string,
    @Body() body: { url: string },
  ) {
    return this.service.add(id, body.url);
  }

  @Delete()
  remove(
    @Param("id") id: string,
    @Body() body: { url: string },
  ) {
    return this.service.remove(id, body.url);
  }

}
