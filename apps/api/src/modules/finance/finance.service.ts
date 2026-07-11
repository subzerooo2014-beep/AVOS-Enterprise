import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateLedgerEntryDto } from './dto/create-ledger-entry.dto';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createInvoice(dto: CreateInvoiceDto) {
    const totalAmount =
      Number(dto.amount) +
      Number(dto.taxAmount ?? 0) -
      Number(dto.discountAmount ?? 0);

    if (totalAmount <= 0) {
      throw new BadRequestException('Invoice total must be greater than zero');
    }

    const invoice = await (this.prisma as any).invoice.create({
      data: {
        saleId: dto.saleId,
        customerId: dto.customerId,
        amount: dto.amount,
        taxAmount: dto.taxAmount ?? 0,
        discountAmount: dto.discountAmount ?? 0,
        totalAmount,
        paidAmount: 0,
        status: 'UNPAID',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        notes: dto.notes,
      },
    });

    await this.createLedgerEntry({
      type: 'INVOICE',
      title: `Invoice created`,
      amount: totalAmount,
      referenceType: 'INVOICE',
      referenceId: invoice.id,
      notes: dto.notes,
    });

    return invoice;
  }

  async listInvoices() {
    return (this.prisma as any).invoice.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInvoice(id: string) {
    const invoice = await (this.prisma as any).invoice.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async createPayment(dto: CreatePaymentDto) {
    const invoice = await (this.prisma as any).invoice.findUnique({
      where: { id: dto.invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (dto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    const newPaidAmount = Number(invoice.paidAmount) + Number(dto.amount);

    if (newPaidAmount > Number(invoice.totalAmount)) {
      throw new BadRequestException('Payment exceeds invoice total');
    }

    const status =
      newPaidAmount >= Number(invoice.totalAmount)
        ? 'PAID'
        : newPaidAmount > 0
          ? 'PARTIALLY_PAID'
          : 'UNPAID';

    const payment = await (this.prisma as any).payment.create({
      data: {
        invoiceId: dto.invoiceId,
        amount: dto.amount,
        method: dto.method ?? 'CASH',
        reference: dto.reference,
        notes: dto.notes,
      },
    });

    await (this.prisma as any).invoice.update({
      where: { id: dto.invoiceId },
      data: {
        paidAmount: newPaidAmount,
        status,
      },
    });

    await this.createLedgerEntry({
      type: 'PAYMENT',
      title: `Payment received`,
      amount: dto.amount,
      referenceType: 'PAYMENT',
      referenceId: payment.id,
      notes: dto.notes,
    });

    return payment;
  }

  async listPayments() {
    return (this.prisma as any).payment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLedgerEntry(dto: CreateLedgerEntryDto) {
    return (this.prisma as any).ledgerEntry.create({
      data: {
        type: dto.type,
        title: dto.title,
        amount: dto.amount,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
        notes: dto.notes,
      },
    });
  }

  async listLedger() {
    return (this.prisma as any).ledgerEntry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async financeSummary() {
    const invoices = await (this.prisma as any).invoice.findMany();
    const payments = await (this.prisma as any).payment.findMany();

    const totalInvoiced = invoices.reduce((sum: number, i: any) => sum + Number(i.totalAmount), 0);
    const totalPaid = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
    const outstanding = totalInvoiced - totalPaid;

    return {
      totalInvoiced,
      totalPaid,
      outstanding,
      invoiceCount: invoices.length,
      paymentCount: payments.length,
    };
  }
}

