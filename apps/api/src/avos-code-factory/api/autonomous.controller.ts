import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AutonomousSoftwareFactoryService } from "../autonomous/autonomous-factory.service";
import { CertifyAutonomousRunDto } from "../dto/certify-autonomous-run.dto";
import { ExecuteAutonomousFactoryDto } from "../dto/execute-autonomous-factory.dto";

@Controller("avos/code-factory/autonomous")
export class FactoryAutonomousController {
  constructor(
    private readonly factory: AutonomousSoftwareFactoryService,
  ) {}

  @Get("status")
  status() {
    return this.factory.status();
  }

  @Get("runs")
  runs() {
    return this.factory.list();
  }

  @Get("runs/:id")
  run(@Param("id") id: string) {
    return this.factory.get(id);
  }

  @Post("execute")
  execute(@Body() dto: ExecuteAutonomousFactoryDto) {
    return this.factory.execute(dto);
  }

  @Post("certify")
  certify(@Body() dto: CertifyAutonomousRunDto) {
    return this.factory.certify(dto);
  }
}
