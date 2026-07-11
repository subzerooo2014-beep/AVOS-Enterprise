import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateChangeWindowDto,
  UpdateChangeWindowStatusDto,
} from "../dto";
import {
  RuntimeChangeWindowService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/change-windows",
)
export class RuntimeChangeWindowController {
  constructor(
    private readonly changeWindows:
      RuntimeChangeWindowService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateChangeWindowDto,
  ) {
    return this.changeWindows.create(dto);
  }

  @Get()
  list() {
    return this.changeWindows.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.changeWindows.get(id);
  }

  @Post(":id/status")
  updateStatus(
    @Param("id")
    id: string,
    @Body()
    dto:
      UpdateChangeWindowStatusDto,
  ) {
    return this.changeWindows
      .updateStatus(id, dto);
  }
}
