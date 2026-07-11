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
exports.PersistentPolicySeedService = void 0;
const common_1 = require("@nestjs/common");
const policy_versioning_service_1 = require("./policy-versioning.service");
let PersistentPolicySeedService = class PersistentPolicySeedService {
    constructor(policies) {
        this.policies = policies;
    }
    async onModuleInit() {
        const summary = await this.policies.getSummary();
        if (summary.totalPolicies > 0) {
            return;
        }
        const defaults = [
            {
                id: "protect-user-deletion",
                name: "Protect User Deletion",
                description: "Requires explicit approval before deleting users",
                enabled: true,
                methods: ["DELETE"],
                pathPrefixes: ["/users"],
                requireApprovalToken: true,
                blockInProduction: false,
                severity: "critical",
            },
            {
                id: "protect-customer-deletion",
                name: "Protect Customer Deletion",
                description: "Requires explicit approval before deleting customers",
                enabled: true,
                methods: ["DELETE"],
                pathPrefixes: ["/customers"],
                requireApprovalToken: true,
                blockInProduction: false,
                severity: "error",
            },
            {
                id: "protect-vehicle-deletion",
                name: "Protect Vehicle Deletion",
                description: "Requires explicit approval before deleting vehicles",
                enabled: true,
                methods: ["DELETE"],
                pathPrefixes: ["/vehicles"],
                requireApprovalToken: true,
                blockInProduction: false,
                severity: "error",
            },
            {
                id: "protect-system-configuration",
                name: "Protect System Configuration",
                description: "Requires approval for sensitive configuration changes",
                enabled: true,
                methods: ["POST", "PUT", "PATCH"],
                pathPrefixes: [
                    "/platform-hardening",
                    "/system-config",
                    "/settings/security",
                ],
                requireApprovalToken: true,
                blockInProduction: false,
                severity: "critical",
            },
            {
                id: "block-development-reset",
                name: "Block Development Reset",
                description: "Blocks reset endpoints in production",
                enabled: true,
                methods: ["POST", "DELETE"],
                pathPrefixes: [
                    "/dev/reset",
                    "/test/reset",
                    "/seed/reset",
                ],
                requireApprovalToken: false,
                blockInProduction: true,
                severity: "critical",
            },
        ];
        for (const policy of defaults) {
            await this.policies.create({
                ...policy,
                changeReason: "Imported from Production Hardening V5 defaults",
                changedBy: "platform-bootstrap",
            });
        }
    }
};
exports.PersistentPolicySeedService = PersistentPolicySeedService;
exports.PersistentPolicySeedService = PersistentPolicySeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [policy_versioning_service_1.PolicyVersioningService])
], PersistentPolicySeedService);
//# sourceMappingURL=persistent-policy-seed.service.js.map