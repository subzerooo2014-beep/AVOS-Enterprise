export interface ReceivePaymentResponse {
  invoiceId: string;
  paymentId: string;
  amount: number;
  invoiceStatus: string;
  paidAmount: number;
  balance: number;
}
