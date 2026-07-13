import { Injectable } from "@nestjs/common";
import { CoreFlowRouterService } from "./core-flow-router.service";
import { CoreFlowSimulationService } from "./core-flow-simulation.service";
import { CoreFlowDigitalTwinService } from "./core-flow-digital-twin.service";
import { CoreFlowControlPlaneService } from "./core-flow-control-plane.service";

@Injectable()
export class CoreFlowFederationOperationsService {
  constructor(
    private readonly router: CoreFlowRouterService,
    private readonly simulations: CoreFlowSimulationService,
    private readonly twins: CoreFlowDigitalTwinService,
    private readonly controlPlane: CoreFlowControlPlaneService,
  ) {}

  plan(flow: string, dto: any = {}) {
    const route = this.router.route(flow, dto);
    const simulation = this.simulations.run(flow, {
      scenario: dto?.scenario ?? "federated-execution",
      assumptions: dto?.assumptions ?? {},
    });

    return {
      flow,
      route,
      simulation,
      plannedAt: new Date().toISOString(),
    };
  }

  dashboard() {
    return {
      controlPlane: this.controlPlane.dashboard(),
      simulations: this.simulations.findAll().slice(0, 25),
      digitalTwins: this.twins.findAll().slice(0, 25),
      generatedAt: new Date().toISOString(),
    };
  }
}
