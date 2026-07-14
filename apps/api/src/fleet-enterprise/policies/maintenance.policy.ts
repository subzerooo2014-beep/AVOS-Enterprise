import { Injectable } from "@nestjs/common";
@Injectable()
export class MaintenancePolicy {
  validate(title: string, description: string) {
    if (title.trim().length < 3) throw new Error("Work order title too short");
    if (description.trim().length < 10) throw new Error("Description too short");
    return true;
  }
}
