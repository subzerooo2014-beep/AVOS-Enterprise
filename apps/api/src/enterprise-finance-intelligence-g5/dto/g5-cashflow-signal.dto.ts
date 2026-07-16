export class CreateG5CashflowSignalDto {
  id!: string;
  category!: string;
  amount!: number;
  forecastDate!: string;
  confirmed!: boolean;
}

export class UpdateG5CashflowSignalDto {
  id?: string;
  category?: string;
  amount?: number;
  forecastDate?: string;
  confirmed?: boolean;
}