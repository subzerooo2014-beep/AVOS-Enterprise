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
var GoogleSearchPublisherRuntimeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSearchPublisherRuntimeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const publisher_vehicle_context_service_1 = require("../channel-runtimes/publisher-vehicle-context.service");
const base_social_publisher_runtime_1 = require("./base-social-publisher-runtime");
const social_content_builder_service_1 = require("./social-content-builder.service");
const social_publication_event_service_1 = require("./social-publication-event.service");
let GoogleSearchPublisherRuntimeService = GoogleSearchPublisherRuntimeService_1 = class GoogleSearchPublisherRuntimeService extends base_social_publisher_runtime_1.BaseSocialPublisherRuntime {
    constructor(prisma, vehicles, contentBuilder, publicationEvents) {
        super(prisma, vehicles, contentBuilder, publicationEvents);
        this.channel = "google_search";
        this.logger = new common_1.Logger(GoogleSearchPublisherRuntimeService_1.name);
    }
};
exports.GoogleSearchPublisherRuntimeService = GoogleSearchPublisherRuntimeService;
exports.GoogleSearchPublisherRuntimeService = GoogleSearchPublisherRuntimeService = GoogleSearchPublisherRuntimeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        publisher_vehicle_context_service_1.PublisherVehicleContextService,
        social_content_builder_service_1.SocialContentBuilderService,
        social_publication_event_service_1.SocialPublicationEventService])
], GoogleSearchPublisherRuntimeService);
//# sourceMappingURL=google-search-publisher-runtime.service.js.map