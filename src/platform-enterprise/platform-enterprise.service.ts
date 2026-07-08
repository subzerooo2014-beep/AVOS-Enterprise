import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlatformEnterpriseService {
  constructor(private readonly prisma: PrismaService) {}

  async health() {
    const [
      users,
      organizations,
      branches,
      vehicles,
      customers,
      suppliers,
      invoices,
      warehouses,
      auditLogs,
    ] = await Promise.all([
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

  async createActivity(action: string, entity?: string, entityId?: string, userId?: string) {
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
}
