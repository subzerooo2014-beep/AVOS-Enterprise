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
exports.RagEngineController = void 0;
const common_1 = require("@nestjs/common");
const rag_engine_service_1 = require("./rag-engine.service");
let RagEngineController = class RagEngineController {
    constructor(rag) {
        this.rag = rag;
    }
    index(dto) {
        return this.rag.index(dto.id, dto.text);
    }
    search(dto) {
        return this.rag.retrieve(dto.question);
    }
};
exports.RagEngineController = RagEngineController;
__decorate([
    (0, common_1.Post)("index"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RagEngineController.prototype, "index", null);
__decorate([
    (0, common_1.Post)("search"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RagEngineController.prototype, "search", null);
exports.RagEngineController = RagEngineController = __decorate([
    (0, common_1.Controller)("ai-rag"),
    __metadata("design:paramtypes", [rag_engine_service_1.RagEngineService])
], RagEngineController);
//# sourceMappingURL=rag-engine.controller.js.map