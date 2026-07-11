import {
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  RuntimeCascadingFailureService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/cascade-analysis",
)
export class RuntimeCascadingFailureController {
  constructor(
    private readonly cascade:
      RuntimeCascadingFailureService,
  ) {}

  @Post(":sourceNodeId")
  analyze(
    @Param("sourceNodeId")
    sourceNodeId: string,
  ) {
    return this.cascade
      .analyze(sourceNodeId);
  }

  @Get()
  list() {
    return this.cascade.list();
  }
}
