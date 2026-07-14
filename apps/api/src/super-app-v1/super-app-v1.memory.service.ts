import { Injectable } from "@nestjs/common";
import { UserMemoryRecord } from "./super-app-v1.types";

@Injectable()
export class SuperAppMemoryService {
  private readonly memories = new Map<string, UserMemoryRecord>();

  get(userId: string): UserMemoryRecord {
    const existing = this.memories.get(userId);

    if (existing) {
      return existing;
    }

    const created: UserMemoryRecord = {
      userId,
      preferredCategories: [],
      preferredCities: [],
      viewedVehicles: [],
      favoriteVehicles: [],
      lastQueries: [],
      updatedAt: new Date().toISOString(),
    };

    this.memories.set(userId, created);
    return created;
  }

  update(
    userId: string,
    input: Partial<Omit<UserMemoryRecord, "userId" | "updatedAt">>,
  ): UserMemoryRecord {
    const current = this.get(userId);

    const next: UserMemoryRecord = {
      ...current,
      ...input,
      userId,
      updatedAt: new Date().toISOString(),
    };

    this.memories.set(userId, next);
    return next;
  }

  rememberQuery(userId: string, query: string) {
    const current = this.get(userId);
    const lastQueries = [query, ...current.lastQueries].slice(0, 10);

    return this.update(userId, { lastQueries });
  }

  addFavorite(userId: string, vehicleId: string) {
    const current = this.get(userId);
    const favoriteVehicles = Array.from(
      new Set([vehicleId, ...current.favoriteVehicles]),
    );

    return this.update(userId, { favoriteVehicles });
  }
}