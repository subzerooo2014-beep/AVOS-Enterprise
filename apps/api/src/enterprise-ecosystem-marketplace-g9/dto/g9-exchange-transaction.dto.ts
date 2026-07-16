export class CreateG9ExchangeTransactionDto {
  id!: string;
  exchangeType!: string;
  status!: string;
  value!: number;
  createdAt!: string;
}

export class UpdateG9ExchangeTransactionDto {
  id?: string;
  exchangeType?: string;
  status?: string;
  value?: number;
  createdAt?: string;
}