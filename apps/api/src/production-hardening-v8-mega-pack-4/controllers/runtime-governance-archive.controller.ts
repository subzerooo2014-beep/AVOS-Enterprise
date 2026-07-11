import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateGovernanceArchiveDto,
} from "../dto";
import {
  RuntimeGovernanceArchiveService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/archives",
)
export class RuntimeGovernanceArchiveController {
  constructor(
    private readonly archives:
      RuntimeGovernanceArchiveService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateGovernanceArchiveDto,
  ) {
    return this.archives.create(
      dto,
    );
  }

  @Get()
  list() {
    return this.archives.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.archives.get(id);
  }

  @Post(":id/verify")
  verify(
    @Param("id")
    id: string,
  ) {
    return this.archives.verify(
      id,
    );
  }
}
