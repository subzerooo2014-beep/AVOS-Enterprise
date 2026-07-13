import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";

import { ModuleRef } from "@nestjs/core";
import { AvosKernelService } from "@avos/os";

import { PrismaService } from "../prisma/prisma.service";
import { AiPublishingPipelineService } from "../ai-publishing-pipeline/ai-publishing-pipeline.service";

import { VehiclesRepository } from "./repositories/vehicles.repository";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(
    VehiclesService.name,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: VehiclesRepository,
    private readonly kernel: AvosKernelService,
    private readonly moduleRef: ModuleRef,
  ) {}

  findAll(query: any = {}) {
    return this.repository.findPage(query);
  }

  stats() {
    return this.repository.stats();
  }

  async findOne(id: string) {
    const vehicle =
      await this.repository.findById(id);

    if (!vehicle) {
      throw new NotFoundException(
        "Vehicle not found",
      );
    }

    return vehicle;
  }

  async create(dto: CreateVehicleDto) {
    const exists =
      await this.repository.findByVin(dto.vin);

    if (exists) {
      throw new ConflictException(
        "VIN already exists",
      );
    }

    const vehicle =
      await this.repository.create(dto);

    void this.afterVehicleCreated(vehicle);

    return vehicle;
  }

  async update(
    id: string,
    dto: UpdateVehicleDto,
  ) {
    await this.findOne(id);

    if (dto.vin) {
      const exists =
        await this.repository.findByVin(
          dto.vin,
        );

      if (exists && exists.id !== id) {
        throw new ConflictException(
          "VIN already exists",
        );
      }
    }

    const vehicle =
      await this.repository.update(id, dto);

    void this.afterVehicleUpdated(
      vehicle,
      dto,
    );

    return vehicle;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.repository.delete(id);

    void this.afterVehicleDeleted(id);

    return {
      deleted: true,
    };
  }

  private async afterVehicleCreated(
    vehicle: any,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          action: "VEHICLE_CREATED",
          entity: "Vehicle",
          entityId: vehicle.id,
        },
      });

      const event =
        await (this.prisma as any).platformEvent.create({
          data: {
            type: "VehicleCreated",
            source: "vehicles.service",
            entityType: "vehicle",
            entityId: vehicle.id,
            status: "new",

            payload: {
              vehicleId: vehicle.id,
              vin: vehicle.vin,
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              status: vehicle.status,
              location: vehicle.location,
            },

            result: {
              message:
                "VehicleCreated event emitted.",
            },
          },
        });

      const decision = this.kernel.decide({
        event: "VehicleCreated",
        entityType: "vehicle",
        entityId: vehicle.id,
        payload: vehicle,
      });

      await (this.prisma as any).kernelDecision.create({
        data: {
          eventType: "VehicleCreated",
          entityType: "vehicle",
          entityId: vehicle.id,
          decision: decision.workflow,
          confidence: decision.confidence,
          reason: decision.reason,
          actions: decision.actions,
          status:
            decision.accepted
              ? "approved"
              : "rejected",
        },
      });

      for (const taskType of decision.actions) {
        await (this.prisma as any).brainTask.create({
          data: {
            eventId: event.id,
            taskType,
            entityType: "vehicle",
            entityId: vehicle.id,
            status: "queued",

            priority:
              taskType === "fraud_assessment"
                ? "high"
                : "medium",

            input: {
              source: "vehicles.service",
              entityType: "vehicle",
              entityId: vehicle.id,
              vehicleId: vehicle.id,
              vin: vehicle.vin,
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              color: vehicle.color,
              status: vehicle.status,
              location: vehicle.location,
              brandId: vehicle.brandId,
              vehicleModelId:
                vehicle.vehicleModelId,
              trimId: vehicle.trimId,
              dealerId: vehicle.dealerId,
              showroomId: vehicle.showroomId,
            },

            reason:
              `Kernel decision triggered ${taskType}.`,
          },
        });
      }

      await this.runPublishingPipeline(
        vehicle.id,
        "VehicleCreated",
      );

      const readiness =
        await this.evaluateVehicleReadiness(
          vehicle,
        );

      await (this.prisma as any).platformEvent.create({
        data: {
          type: "VehicleReadinessEvaluated",
          source: "vehicles.service",
          entityType: "vehicle",
          entityId: vehicle.id,
          status: "completed",
          payload: readiness,
          result: {
            message:
              "Vehicle readiness evaluated.",
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `VehicleCreated pipeline failed: vehicleId=${String(
          vehicle?.id ?? "unknown",
        )}, error=${this.errorMessage(error)}`,
        error instanceof Error
          ? error.stack
          : undefined,
      );
    }
  }

  private async afterVehicleUpdated(
    vehicle: any,
    dto: UpdateVehicleDto,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          action: "VEHICLE_UPDATED",
          entity: "Vehicle",
          entityId: vehicle.id,
        },
      });

      await (this.prisma as any).platformEvent.create({
        data: {
          type: "VehicleUpdated",
          source: "vehicles.service",
          entityType: "vehicle",
          entityId: vehicle.id,
          status: "new",
          payload: dto,

          result: {
            message:
              "VehicleUpdated event emitted.",
          },
        },
      });

      if (
        this.requiresRepublishing(dto)
      ) {
        await this.runPublishingPipeline(
          vehicle.id,
          "VehicleUpdated",
        );
      }
    } catch (error) {
      this.logger.error(
        `VehicleUpdated pipeline failed: vehicleId=${String(
          vehicle?.id ?? "unknown",
        )}, error=${this.errorMessage(error)}`,
        error instanceof Error
          ? error.stack
          : undefined,
      );
    }
  }

  private async afterVehicleDeleted(
    id: string,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          action: "VEHICLE_DELETED",
          entity: "Vehicle",
          entityId: id,
        },
      });

      await (this.prisma as any).platformEvent.create({
        data: {
          type: "VehicleDeleted",
          source: "vehicles.service",
          entityType: "vehicle",
          entityId: id,
          status: "new",
          payload: {
            vehicleId: id,
          },

          result: {
            message:
              "VehicleDeleted event emitted.",
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `VehicleDeleted pipeline failed: vehicleId=${id}, error=${this.errorMessage(
          error,
        )}`,
        error instanceof Error
          ? error.stack
          : undefined,
      );
    }
  }

  private async runPublishingPipeline(
    vehicleId: string,
    trigger: string,
  ): Promise<void> {
    const pipeline = this.moduleRef.get(
      AiPublishingPipelineService,
      {
        strict: false,
      },
    );

    if (!pipeline) {
      this.logger.warn(
        `AI Publishing Pipeline is unavailable: vehicleId=${vehicleId}, trigger=${trigger}`,
      );

      return;
    }

    const result = await pipeline.run(
      vehicleId,
    );

    this.logger.log(
      `AI Publishing Pipeline completed: vehicleId=${vehicleId}, trigger=${trigger}, jobsCreated=${Number(
        result?.jobsCreated ?? 0,
      )}`,
    );
  }

  private requiresRepublishing(
    dto: UpdateVehicleDto,
  ): boolean {
    const fields = Object.keys(
      dto as Record<string, unknown>,
    );

    if (fields.length === 0) {
      return false;
    }

    const publishingFields = new Set([
      "vin",
      "make",
      "model",
      "year",
      "color",
      "status",
      "location",
      "price",
      "description",
      "brandId",
      "vehicleModelId",
      "trimId",
      "dealerId",
      "showroomId",
      "mileage",
      "images",
    ]);

    return fields.some((field) =>
      publishingFields.has(field),
    );
  }


  private async evaluateVehicleReadiness(
    vehicle: any,
  ): Promise<any> {
    const result = {
      qualityScore: 100,
      fraudRisk: "low" as "low" | "medium" | "high",
      inspectionReady: false,
      marketplaceEligible: false,
      publishingAllowed: false,
      reasons: [] as string[],
    };

    if (!vehicle.images || vehicle.images.length < 5) {
      result.qualityScore -= 15;
      result.reasons.push("Not enough images");
    }

    if (!vehicle.description || vehicle.description.length < 100) {
      result.qualityScore -= 10;
      result.reasons.push("Description too short");
    }

    if (!vehicle.price) {
      result.qualityScore -= 20;
      result.reasons.push("Missing price");
    }

    if (!vehicle.location) {
      result.qualityScore -= 5;
      result.reasons.push("Missing location");
    }

    if (result.qualityScore < 70) {
      result.fraudRisk = "medium";
    }

    if (result.qualityScore < 50) {
      result.fraudRisk = "high";
    }

    result.inspectionReady =
      result.qualityScore >= 80;

    result.marketplaceEligible =
      result.inspectionReady &&
      result.fraudRisk === "low";

    const financeEligible =
      result.qualityScore >= 75;

    const insuranceEligible =
      result.qualityScore >= 70;

    const marketplaceScore =
      Math.min(
        100,
        result.qualityScore +
          (financeEligible ? 5 : 0) +
          (insuranceEligible ? 5 : 0),
      );

    result.publishingAllowed =
      result.marketplaceEligible &&
      financeEligible &&
      insuranceEligible;

    result.reasons.push(
      `Finance Eligible: ${financeEligible}`,
    );

    result.reasons.push(
      `Insurance Eligible: ${insuranceEligible}`,
    );

    result.reasons.push(
      `Marketplace Score: ${marketplaceScore}`,
    );

    const decision =
      result.publishingAllowed
        ? "approved"
        : result.marketplaceEligible
          ? "review"
          : "rejected";

    const priority =
      result.qualityScore >= 90
        ? "high"
        : result.qualityScore >= 75
          ? "normal"
          : "low";

    return {
      ...result,
      decision,
      priority,
      nextActions:
        decision === "approved"
          ? [
              "publish",
              "notify-marketplace",
              "notify-dealer",
            ]
          : decision === "review"
            ? [
                "manual-review",
                "inspection",
              ]
            : [
                "complete-missing-data",
              ],
      recommendations: [...result.reasons],
    };
  }
  private errorMessage(
    error: unknown,
  ): string {
    return error instanceof Error
      ? error.message
      : String(
          error ?? "Unknown vehicle pipeline error",
        );
  }
}
