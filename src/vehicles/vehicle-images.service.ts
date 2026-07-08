import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleImagesService {

  private readonly storage = new Map<string, string[]>();

  list(vehicleId: string) {
    return this.storage.get(vehicleId) ?? [];
  }

  add(vehicleId: string, url: string) {
    const items = this.storage.get(vehicleId) ?? [];
    items.push(url);
    this.storage.set(vehicleId, items);
    return items;
  }

  remove(vehicleId: string, url: string) {
    const items = (this.storage.get(vehicleId) ?? []).filter(x => x !== url);
    this.storage.set(vehicleId, items);
    return items;
  }

}
