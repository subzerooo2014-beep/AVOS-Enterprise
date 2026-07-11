import { RuntimeGovernanceDashboardService } from "../services";
export declare class RuntimeGovernanceDashboardController {
    private readonly dashboard;
    constructor(dashboard: RuntimeGovernanceDashboardService);
    snapshot(): import("..").GovernanceDashboardSnapshot;
}
