import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleSlugService {
  create(vehicle: any): string {
    if (!vehicle?.id) {
      throw new Error(
        "Vehicle id is required to generate a public slug",
      );
    }

    const base = [
      vehicle.year,
      vehicle.make,
      vehicle.model,
      vehicle.trim?.name,
      vehicle.color,
    ]
      .filter(Boolean)
      .map((value) => String(value))
      .join(" ");

    const normalized = this.slugify(base);
    const suffix = String(vehicle.id).slice(-8).toLowerCase();

    return normalized
      ? `${normalized}-${suffix}`
      : `vehicle-${suffix}`;
  }

  private slugify(value: string): string {
    return value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-")
      .slice(0, 120);
  }
}
