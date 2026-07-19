import { Injectable } from '@nestjs/common';
import {
  EnterpriseCertification,
  EnterpriseDeploymentRelease,
  EnterpriseFactoryRegistration,
  EnterprisePlan,
  EnterprisePortfolio,
  EnterpriseResource,
  EnterpriseWorkOrder,
} from './enterprise-factory.types';

@Injectable()
export class EnterpriseFactoryStore {
  readonly factories = new Map<string, EnterpriseFactoryRegistration>();
  readonly portfolios = new Map<string, EnterprisePortfolio>();
  readonly resources = new Map<string, EnterpriseResource>();
  readonly workOrders = new Map<string, EnterpriseWorkOrder>();
  readonly plans = new Map<string, EnterprisePlan>();
  readonly releases = new Map<string, EnterpriseDeploymentRelease>();
  readonly certifications = new Map<string, EnterpriseCertification>();
}