import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateLedgerEntryDto } from './dto/create-ledger-entry.dto';
export declare class FinanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createInvoice(dto: CreateInvoiceDto): Promise<any>;
    listInvoices(): Promise<any>;
    getInvoice(id: string): Promise<any>;
    createPayment(dto: CreatePaymentDto): Promise<any>;
    listPayments(): Promise<any>;
    createLedgerEntry(dto: CreateLedgerEntryDto): Promise<any>;
    listLedger(): Promise<any>;
    financeSummary(): Promise<{
        totalInvoiced: any;
        totalPaid: any;
        outstanding: number;
        invoiceCount: any;
        paymentCount: any;
    }>;
}
