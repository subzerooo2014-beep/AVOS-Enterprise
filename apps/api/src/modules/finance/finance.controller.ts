import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateLedgerEntryDto } from './dto/create-ledger-entry.dto';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('invoices')
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.financeService.createInvoice(dto);
  }

  @Get('invoices')
  listInvoices() {
    return this.financeService.listInvoices();
  }

  @Get('invoices/:id')
  getInvoice(@Param('id') id: string) {
    return this.financeService.getInvoice(id);
  }

  @Post('payments')
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.financeService.createPayment(dto);
  }

  @Get('payments')
  listPayments() {
    return this.financeService.listPayments();
  }

  @Post('ledger')
  createLedgerEntry(@Body() dto: CreateLedgerEntryDto) {
    return this.financeService.createLedgerEntry(dto);
  }

  @Get('ledger')
  listLedger() {
    return this.financeService.listLedger();
  }

  @Get('summary')
  summary() {
    return this.financeService.financeSummary();
  }
}
