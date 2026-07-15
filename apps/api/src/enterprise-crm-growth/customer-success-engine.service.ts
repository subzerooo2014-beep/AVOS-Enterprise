import { Injectable } from '@nestjs/common';
import { CustomerProfile } from './enterprise-crm-growth.types';

@Injectable()
export class CustomerSuccessEngineService {
  evaluate(customers: CustomerProfile[]) {
    return customers.map((customer) => ({
      customerId: customer.id,
      successScore: Math.round(
        customer.engagementScore * 0.4 +
          customer.satisfactionScore * 0.4 +
          Math.min(100, customer.lifetimeValue / 1000) * 0.2,
      ),
      needsAttention:
        customer.engagementScore < 50 ||
        customer.satisfactionScore < 60,
    }));
  }
}