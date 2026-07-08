export class CrmQueryDto {
  search?: string;
  status?: string;
  priority?: string;
  source?: string;
  assignedToId?: string;
  customerId?: string;
  vehicleId?: string;
  page?: number;
  limit?: number;
  take?: number;
}
