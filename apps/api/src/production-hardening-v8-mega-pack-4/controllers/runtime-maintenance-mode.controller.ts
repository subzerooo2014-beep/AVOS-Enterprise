import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import {
  CreateMaintenanceModeDto,
  UpdateMaintenanceModeStatusDto,
} from "../dto";
import {
  RuntimeMaintenanceModeService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/maintenance-modes",
)
export class RuntimeMaintenanceModeController {
  constructor(
    private readonly maintenance:
      RuntimeMaintenanceModeService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateMaintenanceModeDto,
  ) {
    return this.maintenance.create(dto);
  }

  @Get()
  list() {
    return this.maintenance.list();
  }

  @Get("access-policy")
  accessPolicy(
    @Query("environment")
    environment: string,
    @Query("namespace")
    namespace: string,
    @Query("service")
    service?: string,
  ) {
    return this.maintenance
      .getAccessPolicy(
        environment,
        namespace,
        service,
      );
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.maintenance.get(id);
  }

  @Post(":id/status")
  updateStatus(
    @Param("id")
    id: string,
    @Body()
    dto:
      UpdateMaintenanceModeStatusDto,
  ) {
    return this.maintenance
      .updateStatus(id, dto);
  }
}
