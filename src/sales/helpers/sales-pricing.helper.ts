import { BadRequestException } from '@nestjs/common';
import { DiscountType } from '../constants/sales.enums';
import { safeNumber, toMoney } from './money.helper';

export interface SalesPricingInput {
  basePrice: number;
  discountType?: DiscountType;
  discountValue?: number;
  taxRate?: number;
  fees?: number;
}

export interface SalesPricingResult {
  basePrice: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  fees: number;
  totalAmount: number;
}

export function calculateSalesPricing(input: SalesPricingInput): SalesPricingResult {
  const basePrice = safeNumber(input.basePrice);
  const discountValue = safeNumber(input.discountValue);
  const taxRate = safeNumber(input.taxRate);
  const fees = safeNumber(input.fees);

  if (basePrice < 0) throw new BadRequestException('basePrice must not be negative');
  if (discountValue < 0) throw new BadRequestException('discountValue must not be negative');
  if (taxRate < 0) throw new BadRequestException('taxRate must not be negative');
  if (fees < 0) throw new BadRequestException('fees must not be negative');

  let discountAmount = 0;

  if (input.discountType === DiscountType.PERCENTAGE) {
    if (discountValue > 100) {
      throw new BadRequestException('percentage discount cannot exceed 100');
    }
    discountAmount = basePrice * (discountValue / 100);
  }

  if (input.discountType === DiscountType.FIXED) {
    discountAmount = discountValue;
  }

  if (discountAmount > basePrice) {
    throw new BadRequestException('discount cannot exceed base price');
  }

  const taxableAmount = basePrice - discountAmount;
  const taxAmount = taxableAmount * (taxRate / 100);
  const totalAmount = taxableAmount + taxAmount + fees;

  return {
    basePrice: toMoney(basePrice),
    discountAmount: toMoney(discountAmount),
    taxableAmount: toMoney(taxableAmount),
    taxAmount: toMoney(taxAmount),
    fees: toMoney(fees),
    totalAmount: toMoney(totalAmount),
  };
}
