"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path = require("path");
let LocalStorageService = class LocalStorageService {
    constructor() {
        this.root = path.join(process.cwd(), "storage");
    }
    async write(filename, content) {
        await fs_1.promises.mkdir(this.root, { recursive: true });
        const filePath = path.join(this.root, filename);
        await fs_1.promises.writeFile(filePath, content, "utf8");
        return { filePath };
    }
};
exports.LocalStorageService = LocalStorageService;
exports.LocalStorageService = LocalStorageService = __decorate([
    (0, common_1.Injectable)()
], LocalStorageService);
//# sourceMappingURL=local-storage.service.js.map