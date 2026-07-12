import {
  V5BusinessRuntimeInput,
  V5LedgerAccount,
  V5SettlementFlow,
} from "./contracts";

export class V5FinancialRuntimeGenerator {
  ledger(input: V5BusinessRuntimeInput): V5LedgerAccount[] {
    return [
      {
        key: "cash-clearing",
        category: "asset",
        currency: input.currency,
        immutable: true,
      },
      {
        key: "seller-payables",
        category: "liability",
        currency: input.currency,
        immutable: true,
      },
      {
        key: "platform-commission-revenue",
        category: "revenue",
        currency: input.currency,
        immutable: true,
      },
      {
        key: "refund-reserve",
        category: "liability",
        currency: input.currency,
        immutable: true,
      },
      {
        key: "payment-processing-expense",
        category: "expense",
        currency: input.currency,
        immutable: true,
      },
    ];
  }

  settlements(input: V5BusinessRuntimeInput): V5SettlementFlow[] {
    return input.marketplaceDomains.flatMap((domain) => [
      {
        key: `${domain.key}.seller-settlement`,
        sourceAccount: "cash-clearing",
        destinationAccount: "seller-payables",
        trigger: `${domain.key}.transaction-cleared`,
        reconciliationRequired: true,
      },
      {
        key: `${domain.key}.commission-recognition`,
        sourceAccount: "cash-clearing",
        destinationAccount: "platform-commission-revenue",
        trigger: `${domain.key}.transaction-cleared`,
        reconciliationRequired: true,
      },
    ]);
  }

  reconciliation(input: V5BusinessRuntimeInput) {
    return {
      currency: input.currency,
      schedules: [
        "hourly payment reconciliation",
        "daily settlement reconciliation",
        "monthly financial close",
      ],
      breakHandling: [
        "detect mismatch",
        "freeze affected settlement",
        "create investigation case",
        "resolve and record evidence",
      ],
      immutableEvidence: true,
    };
  }
}
