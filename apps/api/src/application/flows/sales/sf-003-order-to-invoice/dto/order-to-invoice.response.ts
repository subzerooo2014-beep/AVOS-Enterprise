export interface OrderToInvoiceResponse {
  orderId: string;
  invoiceId: string;
  customerId: string | null;
  invoiceNumber: string;
  total: number;
  balance: number;
  status: string;
}
