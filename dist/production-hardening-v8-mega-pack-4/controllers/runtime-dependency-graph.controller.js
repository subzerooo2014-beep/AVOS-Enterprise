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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeDependencyGraphController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeDependencyGraphController = class RuntimeDependencyGraphController {
    constructor(graph) {
        this.graph = graph;
    }
    createNode(dto) {
        return this.graph
            .createNode(dto);
    }
    createEdge(dto) {
        return this.graph
            .createEdge(dto);
    }
    updateHealth(id, dto) {
        return this.graph
            .updateHealth(id, dto);
    }
    listNodes() {
        return this.graph
            .listNodes();
    }
    listEdges() {
        return this.graph
            .listEdges();
    }
    getNode(id) {
        return this.graph
            .getNode(id);
    }
    getEdge(id) {
        return this.graph
            .getEdge(id);
    }
    snapshot(environment, namespace) {
        return this.graph
            .getGraphSnapshot(environment, namespace);
    }
};
exports.RuntimeDependencyGraphController = RuntimeDependencyGraphController;
__decorate([
    (0, common_1.Post)("nodes"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateDependencyNodeDto]),
    __metadata("design:returntype", void 0)
], RuntimeDependencyGraphController.prototype, "createNode", null);
__decorate([
    (0, common_1.Post)("edges"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateDependencyEdgeDto]),
    __metadata("design:returntype", void 0)
], RuntimeDependencyGraphController.prototype, "createEdge", null);
__decorate([
    (0, common_1.Post)("nodes/:id/health"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateDependencyHealthDto]),
    __metadata("design:returntype", void 0)
], RuntimeDependencyGraphController.prototype, "updateHealth", null);
__decorate([
    (0, common_1.Get)("nodes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeDependencyGraphController.prototype, "listNodes", null);
__decorate([
    (0, common_1.Get)("edges"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeDependencyGraphController.prototype, "listEdges", null);
__decorate([
    (0, common_1.Get)("nodes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeDependencyGraphController.prototype, "getNode", null);
__decorate([
    (0, common_1.Get)("edges/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeDependencyGraphController.prototype, "getEdge", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __param(0, (0, common_1.Query)("environment")),
    __param(1, (0, common_1.Query)("namespace")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RuntimeDependencyGraphController.prototype, "snapshot", null);
exports.RuntimeDependencyGraphController = RuntimeDependencyGraphController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/dependencies"),
    __metadata("design:paramtypes", [services_1.RuntimeDependencyGraphService])
], RuntimeDependencyGraphController);
//# sourceMappingURL=runtime-dependency-graph.controller.js.map