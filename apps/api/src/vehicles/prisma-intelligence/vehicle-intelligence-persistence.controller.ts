import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { VehicleIntelligencePersistenceService } from "./vehicle-intelligence-persistence.service";
import { VehicleIntelligencePersistenceInput } from "./vehicle-intelligence-persistence.types";

@Controller("vehicle-intelligence-records")
export class VehicleIntelligencePersistenceController {
  constructor(
    private readonly persistence: VehicleIntelligencePersistenceService,
  ) {}

  @Post()
  async upsert(@Body() input: VehicleIntelligencePersistenceInput) {
    return {
      success: true,
      record: await this.persistence.upsert(input),
    };
  }

  @Get()
  async list(@Query("limit") limit?: string) {
    return {
      success: true,
      records: await this.persistence.list(
        limit ? Number(limit) : 50,
      ),
    };
  }

  @Get("stats")
  async stats() {
    return {
      success: true,
      ...(await this.persistence.stats()),
    };
  }

  @Get("vehicle/:vehicleId")
  async byVehicle(@Param("vehicleId") vehicleId: string) {
    return {
      success: true,
      records: await this.persistence.findByVehicleId(vehicleId),
    };
  }

  @Get("lifecycle/:lifecycleId")
  async byLifecycle(@Param("lifecycleId") lifecycleId: string) {
    const record =
      await this.persistence.findByLifecycleId(lifecycleId);

    return {
      success: Boolean(record),
      record: record ?? null,
    };
  }
}
