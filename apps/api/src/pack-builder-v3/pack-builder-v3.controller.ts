import { Controller, Get } from "@nestjs/common";
import { PackBuilderV3Service } from "./pack-builder-v3.service";

@Controller("pack-builder-v3")
export class PackBuilderV3Controller {
  constructor(private readonly service: PackBuilderV3Service) {}

  @Get("status")
  status() {
    return this.service.status();
  }
}