import { MegaPack6BootstrapService } from "./mega-pack-6-bootstrap.service";
import { MegaPack6DashboardService } from "./mega-pack-6-dashboard.service";
export declare class MegaPack6Controller {
    private readonly bootstrapService;
    private readonly dashboard;
    constructor(bootstrapService: MegaPack6BootstrapService, dashboard: MegaPack6DashboardService);
    bootstrap(): Promise<Record<string, unknown>>;
    status(): Promise<Record<string, unknown>>;
}
