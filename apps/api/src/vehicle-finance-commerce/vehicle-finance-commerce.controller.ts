import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePaymentDto } from './dto/payment.dto';
import { FinancingApplicationDto } from './dto/financing-application.dto';
import { InsuranceQuoteDto } from './dto/insurance-quote.dto';
import { PaymentOrchestrationEngineService } from './payment-orchestration-engine.service';
import { FinancingApplicationEngineService } from './financing-application-engine.service';
import { InsuranceQuotationEngineService } from './insurance-quotation-engine.service';
import { FinanceCommerceDashboardService } from './finance-commerce-dashboard.service';
import { VEHICLE_FINANCE_COMMERCE_CAPABILITIES } from './vehicle-finance-commerce.types';

@Controller('vehicle-finance-commerce')
export class VehicleFinanceCommerceController {
  constructor(
    private readonly payments: PaymentOrchestrationEngineService,
    private readonly financing: FinancingApplicationEngineService,
    private readonly insurance: InsuranceQuotationEngineService,
    private readonly dashboard: FinanceCommerceDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle S — Payments, Finance, Insurance & Contracts',
      count: VEHICLE_FINANCE_COMMERCE_CAPABILITIES.length,
      capabilities: VEHICLE_FINANCE_COMMERCE_CAPABILITIES,
    };
  }

  @Post('payments')
  createPayment(@Body() input: CreatePaymentDto) {
    return this.payments.create(input);
  }

  @Post('financing/evaluate')
  evaluateFinancing(@Body() input: FinancingApplicationDto) {
    return this.financing.evaluate(input);
  }

  @Post('insurance/rank')
  rankInsurance(@Body() input: { quotes: InsuranceQuoteDto[] }) {
    return this.insurance.rank(input.quotes);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}