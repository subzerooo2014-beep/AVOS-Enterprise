export enum SalesStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONVERTED = 'CONVERTED',
  CANCELLED = 'CANCELLED',
}

export enum QuoteValidityStatus {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SIGNED = 'SIGNED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentPlanType {
  CASH = 'CASH',
  INSTALLMENT = 'INSTALLMENT',
  BANK_FINANCE = 'BANK_FINANCE',
  LEASING = 'LEASING',
}

export enum DiscountType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}
