import { Controller, Get } from "@nestjs/common";
import { OmegaExecutiveFacadeService } from "./omega-executive-facade.service";

@Controller("inspection-certification/omega/executive")
export class OmegaExecutiveController {
  constructor(
    private readonly facade: OmegaExecutiveFacadeService,
  ) {}

  @Get("status")
  status() {
    return this.facade.status();
  }

  @Get("overview")
  overview() {
    return this.facade.overview();
  }

  @Get("history")
  history() {
    return this.facade.history();
  }

  @Get("trends")
  trends() {
    return this.facade.trendReport();
  }

  @Get("delta")
  delta() {
    return this.facade.deltaReport();
  }
}
