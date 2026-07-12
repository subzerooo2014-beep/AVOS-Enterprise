import { randomUUID } from "node:crypto";

export interface ValueAccount {
  key: string;
  currency: string;
  balance: number;
  trustScore: number;
  dailyLimit: number;
}

export interface ValueTransfer {
  key: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  priority: number;
}

export interface SettledValueTransfer {
  id: string;
  transferKey: string;
  settled: boolean;
  fee: number;
  reason: string;
}

export interface UniversalValueExchangeResult {
  settlements: SettledValueTransfer[];
  totalSettledValue: number;
  rejectedTransfers: number;
  settledAt: string;
}

export class UniversalValueExchange {
  settle(
    accounts: readonly ValueAccount[],
    transfers: readonly ValueTransfer[],
  ): UniversalValueExchangeResult {
    const balances = new Map(accounts.map((account) => [account.key, account.balance]));
    const accountMap = new Map(accounts.map((account) => [account.key, account]));
    const settlements: SettledValueTransfer[] = [];

    for (const transfer of [...transfers].sort((a, b) => b.priority - a.priority)) {
      const source = accountMap.get(transfer.from);
      const target = accountMap.get(transfer.to);
      const sourceBalance = balances.get(transfer.from) ?? 0;

      let settled = true;
      let reason = "settled";

      if (!source || !target) {
        settled = false;
        reason = "account-not-found";
      } else if (
        source.currency !== transfer.currency ||
        target.currency !== transfer.currency
      ) {
        settled = false;
        reason = "currency-mismatch";
      } else if (source.trustScore < 70 || target.trustScore < 70) {
        settled = false;
        reason = "trust-threshold-failed";
      } else if (transfer.amount > source.dailyLimit) {
        settled = false;
        reason = "daily-limit-exceeded";
      } else if (sourceBalance < transfer.amount) {
        settled = false;
        reason = "insufficient-balance";
      }

      const fee = settled
        ? Math.round(transfer.amount * 0.005 * 100) / 100
        : 0;

      if (settled) {
        balances.set(transfer.from, sourceBalance - transfer.amount - fee);
        balances.set(
          transfer.to,
          (balances.get(transfer.to) ?? 0) + transfer.amount,
        );
      }

      settlements.push({
        id: randomUUID(),
        transferKey: transfer.key,
        settled,
        fee,
        reason,
      });
    }

    return {
      settlements,
      totalSettledValue: Math.round(
        transfers
          .filter((transfer) =>
            settlements.some(
              (settlement) =>
                settlement.transferKey === transfer.key &&
                settlement.settled,
            ),
          )
          .reduce((sum, transfer) => sum + transfer.amount, 0) * 100,
      ) / 100,
      rejectedTransfers: settlements.filter((item) => !item.settled).length,
      settledAt: new Date().toISOString(),
    };
  }
}
