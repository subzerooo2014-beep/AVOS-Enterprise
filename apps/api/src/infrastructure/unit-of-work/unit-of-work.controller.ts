import { Controller, Get } from "@nestjs/common";
import { UnitOfWorkService } from "./unit-of-work.service";

@Controller("persistence-foundation/unit-of-work")
export class UnitOfWorkController {
  constructor(private readonly unitOfWorkService: UnitOfWorkService) {}

  @Get("status")
  status() {
    return this.unitOfWorkService.status();
  }
}
