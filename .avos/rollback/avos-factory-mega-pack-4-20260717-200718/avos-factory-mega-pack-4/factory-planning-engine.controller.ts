import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { PlanningArchitectureInput } from "./factory-planning.contracts";
import { FactoryPlanningEngineService } from "./factory-planning-engine.service";

@Controller("avos/factory/planning")
export class FactoryPlanningEngineController {
  constructor(
    private readonly planningEngine: FactoryPlanningEngineService
  ) {}

  @Get("status")
  getStatus() {
    return this.planningEngine.getStatus();
  }

  @Get("plans")
  listPlans() {
    return this.planningEngine.listPlans();
  }

  @Get("plans/:id")
  getPlan(@Param("id") id: string) {
    return this.planningEngine.getPlan(id);
  }

  @Post("plans")
  createPlan(@Body() input: PlanningArchitectureInput) {
    return this.planningEngine.createPlan(input);
  }

  @Post("plans/:id/approve")
  approvePlan(
    @Param("id") id: string,
    @Body() body: { approvedBy: string }
  ) {
    return this.planningEngine.approvePlan(
      id,
      body.approvedBy
    );
  }

  @Post("smoke")
  runSmoke() {
    return this.planningEngine.runSmoke();
  }
}
