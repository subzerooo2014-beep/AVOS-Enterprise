export class CreateG10ExecutionOrderDto {
  id!: string;
  orderType!: string;
  status!: string;
  createdAt!: string;
  completedAt?: string;
}

export class UpdateG10ExecutionOrderDto {
  id?: string;
  orderType?: string;
  status?: string;
  createdAt?: string;
  completedAt?: string;
}