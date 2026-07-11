export class CreateCrmDto {
  name!: string;
  phone?: string;
  email?: string;
  source?: string;
  status?: string;
  priority?: string;
  notes?: string;
  assignedToId?: string;
  customerId?: string;
  vehicleId?: string;
  expectedValue?: number;
  nextFollowUpAt?: string;
}
