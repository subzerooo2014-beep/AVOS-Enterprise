import { Module } from "@nestjs/common";
import { FleetEnterpriseController } from "./fleet-enterprise.controller";
import { FleetEnterpriseService } from "./fleet-enterprise.service";
import { FleetVehiclePolicy } from "./policies/fleet-vehicle.policy";
import { DriverAssignmentPolicy } from "./policies/driver-assignment.policy";
import { TripPolicy } from "./policies/trip.policy";
import { MaintenancePolicy } from "./policies/maintenance.policy";
import { FuelPolicy } from "./policies/fuel.policy";
import { SafetyPolicy } from "./policies/safety.policy";
import { AccidentPolicy } from "./policies/accident.policy";
import { RoutePolicy } from "./policies/route.policy";
import { FleetRepositoryService } from "./services/fleet-repository.service";
import { FleetVehicleService } from "./services/fleet-vehicle.service";
import { FleetDriverService } from "./services/fleet-driver.service";
import { DriverAssignmentService } from "./services/driver-assignment.service";
import { TripService } from "./services/trip.service";
import { WorkOrderService } from "./services/work-order.service";
import { FuelManagementService } from "./services/fuel-management.service";
import { GpsService } from "./services/gps.service";
import { TelematicsService } from "./services/telematics.service";
import { AccidentService } from "./services/accident.service";
import { ClaimService } from "./services/claim.service";
import { RouteService } from "./services/route.service";
import { TyreManagementService } from "./services/tyre-management.service";
import { PartsManagementService } from "./services/parts-management.service";
import { FleetAlertService } from "./services/fleet-alert.service";
import { FleetNotificationService } from "./services/fleet-notification.service";
import { FleetAuditService } from "./services/fleet-audit.service";
import { FleetReportingService } from "./services/fleet-reporting.service";
import { FleetDashboardService } from "./services/fleet-dashboard.service";
import { FleetHealthService } from "./services/fleet-health.service";
import { FleetComplianceService } from "./services/fleet-compliance.service";
import { FleetKpiService } from "./services/fleet-kpi.service";
import { DriverPerformanceService } from "./services/driver-performance.service";
import { FleetSchedulerService } from "./services/fleet-scheduler.service";
import { PredictiveMaintenanceEngine } from "./ai/predictive-maintenance.engine";
import { FuelOptimizationEngine } from "./ai/fuel-optimization.engine";
import { DriverRiskEngine } from "./ai/driver-risk.engine";
import { RouteOptimizationEngine } from "./ai/route-optimization.engine";
import { FleetCostEngine } from "./ai/fleet-cost.engine";
import { VehicleUtilizationEngine } from "./ai/vehicle-utilization.engine";
import { FleetAnomalyEngine } from "./ai/fleet-anomaly.engine";
import { FleetDemandEngine } from "./ai/fleet-demand.engine";

@Module({
  controllers: [FleetEnterpriseController],
  providers: [
    FleetEnterpriseService,
    FleetVehiclePolicy,
    DriverAssignmentPolicy,
    TripPolicy,
    MaintenancePolicy,
    FuelPolicy,
    SafetyPolicy,
    AccidentPolicy,
    RoutePolicy,
    FleetRepositoryService,
    FleetVehicleService,
    FleetDriverService,
    DriverAssignmentService,
    TripService,
    WorkOrderService,
    FuelManagementService,
    GpsService,
    TelematicsService,
    AccidentService,
    ClaimService,
    RouteService,
    TyreManagementService,
    PartsManagementService,
    FleetAlertService,
    FleetNotificationService,
    FleetAuditService,
    FleetReportingService,
    FleetDashboardService,
    FleetHealthService,
    FleetComplianceService,
    FleetKpiService,
    DriverPerformanceService,
    FleetSchedulerService,
    PredictiveMaintenanceEngine,
    FuelOptimizationEngine,
    DriverRiskEngine,
    RouteOptimizationEngine,
    FleetCostEngine,
    VehicleUtilizationEngine,
    FleetAnomalyEngine,
    FleetDemandEngine,
  ],
  exports: [FleetEnterpriseService],
})
export class FleetEnterpriseModule {}
