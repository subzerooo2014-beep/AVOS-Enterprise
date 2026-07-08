import { Body, Controller, Post } from "@nestjs/common";
import { AiCoreService } from "./ai-core.service";
import { AiRequestDto } from "./dto/ai-request.dto";

@Controller("ai-core")
export class AiCoreController {
  constructor(private service: AiCoreService) {}

  @Post("run")
  run(@Body() dto: AiRequestDto) {
    return this.service.run(dto);
  }
}
