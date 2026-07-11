"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherBootstrapService = void 0;
const common_1 = require("@nestjs/common");
let PublisherBootstrapService = class PublisherBootstrapService {
    async onModuleInit() {
        console.log("[PublisherEngineV2] Ready");
    }
};
exports.PublisherBootstrapService = PublisherBootstrapService;
exports.PublisherBootstrapService = PublisherBootstrapService = __decorate([
    (0, common_1.Injectable)()
], PublisherBootstrapService);
//# sourceMappingURL=publisher-bootstrap.service.js.map