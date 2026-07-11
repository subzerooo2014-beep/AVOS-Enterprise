"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaPack6BootstrapService = void 0;
const common_1 = require("@nestjs/common");
const mega_pack_6_constants_1 = require("./constants/mega-pack-6.constants");
const compliance_baseline_service_1 = require("./compliance-baseline.service");
const control_scheduler_service_1 = require("./control-scheduler.service");
const mega_pack_6_storage_service_1 = require("./mega-pack-6-storage.service");
let MegaPack6BootstrapService = class MegaPack6BootstrapService {
    constructor(storage, baselines, scheduler) {
        this.storage = storage;
        this.baselines = baselines;
        this.scheduler = scheduler;
    }
    async onModuleInit() {
        await this.ensureCollections();
    }
    async bootstrap() {
        await this.ensureCollections();
        const baselineSeed = await this.baselines.seedDefaults();
        const scheduleSeed = await this.scheduler.seedDefaults();
        return {
            success: true,
            system: mega_pack_6_constants_1.MEGA_PACK_6_SYSTEM.name,
            version: mega_pack_6_constants_1.MEGA_PACK_6_SYSTEM.version,
            initializedAt: new Date().toISOString(),
            baselineSeed,
            scheduleSeed,
        };
    }
    async ensureCollections() {
        await this.storage.ensureCollections(Object.values(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS));
    }
};
exports.MegaPack6BootstrapService = MegaPack6BootstrapService;
exports.MegaPack6BootstrapService = MegaPack6BootstrapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mega_pack_6_storage_service_1.MegaPack6StorageService,
        compliance_baseline_service_1.ComplianceBaselineService,
        control_scheduler_service_1.ControlSchedulerService])
], MegaPack6BootstrapService);
//# sourceMappingURL=mega-pack-6-bootstrap.service.js.map