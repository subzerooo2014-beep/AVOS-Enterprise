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
exports.PlatformEnterpriseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PlatformEnterpriseService = class PlatformEnterpriseService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async health() {
        const [users, organizations, branches, vehicles, customers, suppliers, invoices, warehouses, auditLogs,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.organization.count(),
            this.prisma.branch.count(),
            this.prisma.vehicle.count(),
            this.prisma.customer.count(),
            this.prisma.supplier.count(),
            this.prisma.invoice.count(),
            this.prisma.warehouse.count(),
            this.prisma.auditLog.count(),
        ]);
        return {
            status: 'OK',
            timestamp: new Date().toISOString(),
            modules: {
                auth: true,
                users: true,
                crm: true,
                sales: true,
                inventory: true,
                finance: true,
                procurement: true,
                warehouse: true,
                platform: true,
            },
            counters: {
                users,
                organizations,
                branches,
                vehicles,
                customers,
                suppliers,
                invoices,
                warehouses,
                auditLogs,
            },
        };
    }
    async enterpriseSummary() {
        return {
            name: 'AVOS Enterprise',
            mode: 'production-ready-core',
            database: 'prisma',
            architecture: 'modular-monolith-ready-for-enterprise',
            generatedAt: new Date().toISOString(),
        };
    }
    async createActivity(action, entity, entityId, userId) {
        return this.prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                userId,
            },
        });
    }
    async recentActivity() {
        return this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async moduleRegistry() {
        return {
            core: [
                'auth',
                'users',
                'roles',
                'permissions',
                'organizations',
                'branches',
            ],
            business: [
                'vehicles',
                'inventory',
                'crm',
                'sales',
                'finance',
                'procurement',
                'warehouse',
            ],
            intelligence: [
                'ai-core',
                'sales-intelligence',
                'crm-intelligence',
                'inventory-intelligence',
                'vehicle-search',
                'vehicle-valuation',
            ],
            infrastructure: [
                'audit',
                'logs',
                'files',
                'media',
                'search',
                'settings',
                'notifications',
                'integrations',
            ],
        };
    }
};
exports.PlatformEnterpriseService = PlatformEnterpriseService;
exports.PlatformEnterpriseService = PlatformEnterpriseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformEnterpriseService);
//# sourceMappingURL=platform-enterprise.service.js.map