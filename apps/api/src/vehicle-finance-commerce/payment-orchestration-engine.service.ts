import { Injectable } from '@nestjs/common';
import {
  PaymentStatus,
  PaymentTransaction,
} from './vehicle-finance-commerce.types';

@Injectable()
export class PaymentOrchestrationEngineService {
  private readonly payments = new Map<string, PaymentTransaction>();

  create(
    payment: Omit<PaymentTransaction, 'status' | 'createdAt'>,
  ): PaymentTransaction {
    const created: PaymentTransaction = {
      ...payment,
      status: 'created',
      createdAt: new Date().toISOString(),
    };

    this.payments.set(created.id, created);
    return { ...created };
  }

  transition(id: string, status: PaymentStatus): PaymentTransaction {
    const current = this.payments.get(id);
    if (!current) {
      throw new Error(`Payment not found: ${id}`);
    }

    const updated = { ...current, status };
    this.payments.set(id, updated);
    return { ...updated };
  }

  list(): PaymentTransaction[] {
    return [...this.payments.values()].map((payment) => ({
      ...payment,
    }));
  }
}