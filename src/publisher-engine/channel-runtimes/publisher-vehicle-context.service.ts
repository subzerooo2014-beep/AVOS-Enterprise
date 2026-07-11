import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherVehicleContextService {
  vehicleId(context: any): string {
    const value =
      context?.vehicleId ??
      context?.result?.vehicleId ??
      context?.result?.entityId ??
      context?.result?.metadata?.vehicleId ??
      null;

    if (
      typeof value !== "string" ||
      !value.trim()
    ) {
      throw new Error(
        "Publisher runtime requires a vehicleId",
      );
    }

    return value.trim();
  }

  async loadVehicle(
    prisma: any,
    context: any,
  ): Promise<any> {
    const vehicleId =
      this.vehicleId(context);

    const vehicle =
      await prisma.vehicle.findUnique({
        where: {
          id: vehicleId,
        },

        include: {
          inventory: true,
          brand: true,
          vehicleModel: true,
          trim: true,
          dealer: true,
          showroom: true,
        },
      });

    if (!vehicle) {
      throw new Error(
        `Vehicle "${vehicleId}" was not found`,
      );
    }

    return vehicle;
  }

  title(vehicle: any): string {
    return [
      vehicle?.year,
      vehicle?.make,
      vehicle?.model,
      vehicle?.trim?.name,
    ]
      .filter(Boolean)
      .join(" ");
  }

  price(
    vehicle: any,
    context: any,
  ): number | null {
    const value =
      vehicle?.inventory?.price ??
      context?.result?.recommendedPrice ??
      context?.result?.creative?.price ??
      null;

    const numeric = Number(value);

    return Number.isFinite(numeric)
      ? numeric
      : null;
  }
}
