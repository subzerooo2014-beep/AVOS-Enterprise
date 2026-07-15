import { Injectable } from '@nestjs/common';
import { TransactionAuditEntry } from './vehicle-finance-commerce.types';

@Injectable()
export class TransactionAuditTrailService {
  private readonly entries: TransactionAuditEntry[] = [];

  record(entry: TransactionAuditEntry) {
    this.entries.push({ ...entry });
    return { ...entry };
  }

  list(transactionId?: string) {
    return this.entries
      .filter(
        (entry) =>
          !transactionId || entry.transactionId === transactionId,
      )
      .map((entry) => ({ ...entry }));
  }
}