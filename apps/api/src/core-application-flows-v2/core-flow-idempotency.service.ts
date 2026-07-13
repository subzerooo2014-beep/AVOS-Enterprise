import { Injectable } from "@nestjs/common";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";

@Injectable()
export class CoreFlowIdempotencyService {
  constructor(private readonly store: CoreFlowDurableStoreService) {}

  async get(key: string) {
    const rows = await this.store.query<any>(
      `SELECT "response_json" FROM "avos_core_flow_idempotency" WHERE "key" = $1`,
      key,
    );
    if (!rows[0]) return null;
    return JSON.parse(rows[0].response_json);
  }

  async save(key: string, response: unknown) {
    await this.store.execute(
      `INSERT INTO "avos_core_flow_idempotency" ("key", "response_json")
       VALUES ($1, $2)
       ON CONFLICT ("key") DO NOTHING`,
      key,
      JSON.stringify(response),
    );
    return response;
  }

  async executeOnce<T>(key: string, work: () => Promise<T>): Promise<T> {
    const existing = await this.get(key);
    if (existing !== null) return existing as T;
    const result = await work();
    await this.save(key, result);
    return result;
  }
}
