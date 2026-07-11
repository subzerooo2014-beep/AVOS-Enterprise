import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  SimulateGovernanceRequestDto,
} from "../dto";
import {
  RuntimeGovernanceSimulationService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/simulations",
)
export class RuntimeGovernanceSimulationController {
  constructor(
    private readonly simulations:
      RuntimeGovernanceSimulationService,
  ) {}

  @Post("requests/:requestId")
  simulate(
    @Param("requestId")
    requestId: string,
    @Body()
    dto:
      SimulateGovernanceRequestDto,
  ) {
    return this.simulations
      .simulate(requestId, dto);
  }

  @Get()
  list() {
    return this.simulations.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.simulations.get(id);
  }
}
