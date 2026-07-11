import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { VehiclesService } from "./vehicles.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";

@Controller("vehicles")
export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  @Get()
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
    @Query("make") make?: string,
    @Query("model") model?: string,
    @Query("year") year?: string,
    @Query("color") color?: string,
    @Query("status") status?: string,
    @Query("location") location?: string,
    @Query("sort") sort?: string,
    @Query("order") order?: "asc" | "desc",
  ) {
    return this.service.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
      make,
      model,
      year: year ? Number(year) : undefined,
      color,
      status,
      location,
      sort,
      order,
    });
  }

  @Get("stats")
  stats() {
    return this.service.stats();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateVehicleDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateVehicleDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
