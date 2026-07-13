import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseRuntimeStateService {
  private readonly state = new Map<string, Record<string, unknown>>();

  set(key: string, value: Record<string, unknown>) {
    const record = {
      key,
      value,
      updatedAt: new Date().toISOString(),
    };

    this.state.set(key, record);
    return record;
  }

  list() {
    return [...this.state.values()];
  }
}
