import { Injectable, NotFoundException } from "@nestjs/common";
@Injectable()
export class FleetRepositoryService {
  private readonly fleets = new Map<string, Record<string, unknown>>();
  save(record: Record<string, unknown> & { id: string }) {
    this.fleets.set(record.id, record);
    return record;
  }
  get(id: string) {
    const record = this.fleets.get(id);
    if (!record) throw new NotFoundException(`Fleet ${id} not found`);
    return record;
  }
  list() { return [...this.fleets.values()]; }
}
