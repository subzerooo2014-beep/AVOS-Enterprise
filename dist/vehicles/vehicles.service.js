"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VehiclesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const os_1 = require("@avos/os");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_publishing_pipeline_service_1 = require("../ai-publishing-pipeline/ai-publishing-pipeline.service");
const vehicles_repository_1 = require("./repositories/vehicles.repository");
let VehiclesService = VehiclesService_1 = class VehiclesService {
    constructor(prisma, repository, kernel, moduleRef) {
        this.prisma = prisma;
        this.repository = repository;
        this.kernel = kernel;
        this.moduleRef = moduleRef;
        this.logger = new common_1.Logger(VehiclesService_1.name);
    }
    findAll(query = {}) {
        return this.repository.findPage(query);
    }
    stats() {
        return this.repository.stats();
    }
    async findOne(id) {
        const vehicle = await this.repository.findById(id);
        if (!vehicle) {
            throw new common_1.NotFoundException("Vehicle not found");
        }
        return vehicle;
    }
    async create(dto) {
        const exists = await this.repository.findByVin(dto.vin);
        if (exists) {
            throw new common_1.ConflictException("VIN already exists");
        }
        const vehicle = await this.repository.create(dto);
        void this.afterVehicleCreated(vehicle);
        return vehicle;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.vin) {
            const exists = await this.repository.findByVin(dto.vin);
            if (exists && exists.id !== id) {
                throw new common_1.ConflictException("VIN already exists");
            }
        }
        const vehicle = await this.repository.update(id, dto);
        void this.afterVehicleUpdated(vehicle, dto);
        return vehicle;
    }
    async remove(id) {
        await this.findOne(id);
        await this.repository.delete(id);
        void this.afterVehicleDeleted(id);
        return {
            deleted: true,
        };
    }
    async afterVehicleCreated(vehicle) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    action: "VEHICLE_CREATED",
                    entity: "Vehicle",
                    entityId: vehicle.id,
                },
            });
            const event = await this.prisma.platformEvent.create({
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
                        message: "VehicleCreated event emitted.",
                    },
                },
            });
            const decision = this.kernel.decide({
                event: "VehicleCreated",
                entityType: "vehicle",
                entityId: vehicle.id,
                payload: vehicle,
            });
            await this.prisma.kernelDecision.create({
                data: {
                    eventType: "VehicleCreated",
                    entityType: "vehicle",
                    entityId: vehicle.id,
                    decision: decision.workflow,
                    confidence: decision.confidence,
                    reason: decision.reason,
                    actions: decision.actions,
                    status: decision.accepted
                        ? "approved"
                        : "rejected",
                },
            });
            for (const taskType of decision.actions) {
                await this.prisma.brainTask.create({
                    data: {
                        eventId: event.id,
                        taskType,
                        entityType: "vehicle",
                        entityId: vehicle.id,
                        status: "queued",
                        priority: taskType === "fraud_assessment"
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
                            vehicleModelId: vehicle.vehicleModelId,
                            trimId: vehicle.trimId,
                            dealerId: vehicle.dealerId,
                            showroomId: vehicle.showroomId,
                        },
                        reason: `Kernel decision triggered ${taskType}.`,
                    },
                });
            }
            await this.runPublishingPipeline(vehicle.id, "VehicleCreated");
        }
        catch (error) {
            this.logger.error(`VehicleCreated pipeline failed: vehicleId=${String(vehicle?.id ?? "unknown")}, error=${this.errorMessage(error)}`, error instanceof Error
                ? error.stack
                : undefined);
        }
    }
    async afterVehicleUpdated(vehicle, dto) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    action: "VEHICLE_UPDATED",
                    entity: "Vehicle",
                    entityId: vehicle.id,
                },
            });
            await this.prisma.platformEvent.create({
                data: {
                    type: "VehicleUpdated",
                    source: "vehicles.service",
                    entityType: "vehicle",
                    entityId: vehicle.id,
                    status: "new",
                    payload: dto,
                    result: {
                        message: "VehicleUpdated event emitted.",
                    },
                },
            });
            if (this.requiresRepublishing(dto)) {
                await this.runPublishingPipeline(vehicle.id, "VehicleUpdated");
            }
        }
        catch (error) {
            this.logger.error(`VehicleUpdated pipeline failed: vehicleId=${String(vehicle?.id ?? "unknown")}, error=${this.errorMessage(error)}`, error instanceof Error
                ? error.stack
                : undefined);
        }
    }
    async afterVehicleDeleted(id) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    action: "VEHICLE_DELETED",
                    entity: "Vehicle",
                    entityId: id,
                },
            });
            await this.prisma.platformEvent.create({
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
                        message: "VehicleDeleted event emitted.",
                    },
                },
            });
        }
        catch (error) {
            this.logger.error(`VehicleDeleted pipeline failed: vehicleId=${id}, error=${this.errorMessage(error)}`, error instanceof Error
                ? error.stack
                : undefined);
        }
    }
    async runPublishingPipeline(vehicleId, trigger) {
        const pipeline = this.moduleRef.get(ai_publishing_pipeline_service_1.AiPublishingPipelineService, {
            strict: false,
        });
        if (!pipeline) {
            this.logger.warn(`AI Publishing Pipeline is unavailable: vehicleId=${vehicleId}, trigger=${trigger}`);
            return;
        }
        const result = await pipeline.run(vehicleId);
        this.logger.log(`AI Publishing Pipeline completed: vehicleId=${vehicleId}, trigger=${trigger}, jobsCreated=${Number(result?.jobsCreated ?? 0)}`);
    }
    requiresRepublishing(dto) {
        const fields = Object.keys(dto);
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
        return fields.some((field) => publishingFields.has(field));
    }
    errorMessage(error) {
        return error instanceof Error
            ? error.message
            : String(error ?? "Unknown vehicle pipeline error");
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = VehiclesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vehicles_repository_1.VehiclesRepository,
        os_1.AvosKernelService,
        core_1.ModuleRef])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map