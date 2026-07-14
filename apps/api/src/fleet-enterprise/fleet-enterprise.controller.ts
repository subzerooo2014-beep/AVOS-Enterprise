import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FleetEnterpriseService } from "./fleet-enterprise.service";
import { FleetDashboardService } from "./services/fleet-dashboard.service";
import { FleetAuditService } from "./services/fleet-audit.service";
import { FleetReportingService } from "./services/fleet-reporting.service";
import { PredictiveMaintenanceEngine } from "./ai/predictive-maintenance.engine";
import { FuelOptimizationEngine } from "./ai/fuel-optimization.engine";
import { DriverRiskEngine } from "./ai/driver-risk.engine";
import { RouteOptimizationEngine } from "./ai/route-optimization.engine";
import { FleetCostEngine } from "./ai/fleet-cost.engine";
import { VehicleUtilizationEngine } from "./ai/vehicle-utilization.engine";
import { FleetAnomalyEngine } from "./ai/fleet-anomaly.engine";
import { FleetDemandEngine } from "./ai/fleet-demand.engine";

@Controller("fleet-enterprise")
export class FleetEnterpriseController {
  constructor(
    private readonly fleet: FleetEnterpriseService,
    private readonly dashboard: FleetDashboardService,
    private readonly audit: FleetAuditService,
    private readonly reports: FleetReportingService,
    private readonly maintenanceAi: PredictiveMaintenanceEngine,
    private readonly fuelAi: FuelOptimizationEngine,
    private readonly driverRiskAi: DriverRiskEngine,
    private readonly routeAi: RouteOptimizationEngine,
    private readonly costAi: FleetCostEngine,
    private readonly utilizationAi: VehicleUtilizationEngine,
    private readonly anomalyAi: FleetAnomalyEngine,
    private readonly demandAi: FleetDemandEngine,
  ) {}

  @Get("health")
  health() {
    return {
      success: true,
      system: "AVOS Fleet & Enterprise Operations",
      status: "healthy",
    };
  }

  @Post("fleets")
  createFleet(@Body() body: any) {
    return { success: true, fleet: this.fleet.createFleet(body) };
  }

  @Get("fleets")
  listFleets() {
    return { success: true, fleets: this.fleet.listFleets() };
  }

  @Get("fleets/:id")
  getFleet(@Param("id") id: string) {
    return { success: true, fleet: this.fleet.getFleet(id) };
  }

  @Post("vehicles")
  registerVehicle(@Body() body: any) {
    return {
      success: true,
      vehicle: this.fleet.registerVehicle(body),
    };
  }

  @Post("drivers")
  registerDriver(@Body() body: any) {
    return {
      success: true,
      driver: this.fleet.registerDriver(body),
    };
  }

  @Post("assignments")
  assign(@Body() body: any) {
    return {
      success: true,
      vehicle: this.fleet.assignDriver(
        body.fleetVehicleId,
        body.driverId,
      ),
    };
  }

  @Post("trips")
  createTrip(@Body() body: any) {
    return { success: true, trip: this.fleet.createTrip(body) };
  }

  @Post("trips/:id/start")
  startTrip(@Param("id") id: string) {
    return { success: true, trip: this.fleet.startTrip(id) };
  }

  @Post("trips/:id/complete")
  completeTrip(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      trip: this.fleet.completeTrip(id, body.distanceKm),
    };
  }

  @Post("work-orders")
  createWorkOrder(@Body() body: any) {
    return {
      success: true,
      workOrder: this.fleet.createWorkOrder(body),
    };
  }

  @Post("fuel")
  recordFuel(@Body() body: any) {
    return { success: true, fuel: this.fleet.recordFuel(body) };
  }

  @Post("gps")
  recordGps(@Body() body: any) {
    return { success: true, gps: this.fleet.recordGps(body) };
  }

  @Post("telematics")
  recordTelematics(@Body() body: any) {
    return {
      success: true,
      reading: this.fleet.recordTelematics(body),
    };
  }

  @Post("accidents")
  recordAccident(@Body() body: any) {
    return {
      success: true,
      accident: this.fleet.recordAccident(body),
    };
  }

  @Post("claims")
  createClaim(@Body() body: any) {
    return { success: true, claim: this.fleet.createClaim(body) };
  }

  @Post("routes")
  createRoute(@Body() body: any) {
    return { success: true, route: this.fleet.createRoute(body) };
  }

  @Post("ai/predictive-maintenance")
  predictiveMaintenance(@Body() body: any) {
    return this.maintenanceAi.evaluate(body);
  }

  @Post("ai/fuel-optimization")
  fuelOptimization(@Body() body: any) {
    return this.fuelAi.evaluate(body);
  }

  @Post("ai/driver-risk")
  driverRisk(@Body() body: any) {
    return this.driverRiskAi.evaluate(body);
  }

  @Post("ai/route-optimization")
  routeOptimization(@Body() body: any) {
    return this.routeAi.optimize(body);
  }

  @Post("ai/fleet-cost")
  fleetCost(@Body() body: any) {
    return this.costAi.calculate(body);
  }

  @Post("ai/utilization")
  utilization(@Body() body: any) {
    return this.utilizationAi.calculate(body);
  }

  @Post("ai/anomaly")
  anomaly(@Body() body: any) {
    return this.anomalyAi.detect(body);
  }

  @Post("ai/demand")
  demand(@Body() body: any) {
    return this.demandAi.forecast(body);
  }

  @Post("reports")
  report(@Body() body: any) {
    return { success: true, report: this.reports.create(body) };
  }

  @Get("operations/dashboard")
  operations() {
    return {
      success: true,
      dashboard: this.dashboard.summary(),
    };
  }

  @Get("operations/audit")
  auditEntries() {
    return {
      success: true,
      entries: this.audit.list(),
    };
  }
}
