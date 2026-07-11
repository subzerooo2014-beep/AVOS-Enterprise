export interface SalesPipelineEntity {
  id: string;
  customerId?: string;
  leadId?: string;
  stage: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}
