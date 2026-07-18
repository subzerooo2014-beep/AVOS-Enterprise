import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GenesisPlatformService } from "./genesis-platform.service";
import { CreateGenesisSessionDto } from "./dto/create-genesis-session.dto";
import { GenesisHumanDecisionDto } from "./dto/genesis-human-decision.dto";

@Controller("genesis-platform")
export class GenesisPlatformController {
  constructor(private readonly genesisPlatform: GenesisPlatformService) {}

  @Get("status")
  status() {
    return this.genesisPlatform.status();
  }

  @Get("verification")
  verification() {
    return this.genesisPlatform.verification();
  }

  @Post("smoke")
  smoke() {
    return this.genesisPlatform.smoke();
  }

  @Post("sessions")
  createSession(@Body() input: CreateGenesisSessionDto) {
    return this.genesisPlatform.createSession(input);
  }

  @Get("sessions")
  sessions() {
    return this.genesisPlatform.sessions();
  }

  @Post("sessions/:id/decision")
  decide(
    @Param("id") id: string,
    @Body() input: GenesisHumanDecisionDto,
  ) {
    return this.genesisPlatform.decide(id, input);
  }

  @Post("sessions/:id/execute")
  execute(@Param("id") id: string) {
    return this.genesisPlatform.execute(id);
  }

  @Get("blueprints")
  blueprints() {
    return this.genesisPlatform.blueprints();
  }

  @Get("artifacts")
  artifacts() {
    return this.genesisPlatform.artifacts();
  }
}
