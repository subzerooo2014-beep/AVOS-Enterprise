import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CRM_STATUSES } from "../constants/crm.constants";

export class CrmPolicy {
  static ensureExists(record: any): void {
    if (!record) {
      throw new NotFoundException("CRM record not found");
    }
  }

  static ensureCanUpdate(record: any): void {
    this.ensureExists(record);

    if (["WON", "LOST", "INACTIVE"].includes(record.status)) {
      throw new BadRequestException("Final CRM records cannot be updated");
    }
  }

  static ensureValidStatus(status: string): void {
    if (!CRM_STATUSES.includes(status as any)) {
      throw new BadRequestException("Invalid CRM status");
    }
  }

  static ensureCanDelete(record: any): void {
    this.ensureExists(record);

    if (["WON"].includes(record.status)) {
      throw new BadRequestException("Won CRM records cannot be deleted");
    }
  }
}
