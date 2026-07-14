import { Injectable } from "@nestjs/common";
@Injectable()
export class EntityPolicy {
  validate(name: string, type: string) {
    if (name.trim().length < 3) throw new Error("Entity name too short");
    if (!["DEALERSHIP","WORKSHOP","PARTS_SELLER","ACCESSORIES_SELLER","SERVICE_PROVIDER"].includes(type)) {
      throw new Error("Invalid marketplace entity type");
    }
    return true;
  }
}
