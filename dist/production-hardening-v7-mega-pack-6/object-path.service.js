"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPathService = void 0;
const common_1 = require("@nestjs/common");
let ObjectPathService = class ObjectPathService {
    get(source, resourcePath) {
        if (!resourcePath) {
            return source;
        }
        const segments = resourcePath
            .replace(/\[(\d+)\]/g, ".$1")
            .split(".")
            .filter(Boolean);
        let current = source;
        for (const segment of segments) {
            if (current === null ||
                current === undefined ||
                typeof current !== "object") {
                return undefined;
            }
            current = current[segment];
        }
        return current;
    }
    exists(source, resourcePath) {
        return (this.get(source, resourcePath) !== undefined);
    }
};
exports.ObjectPathService = ObjectPathService;
exports.ObjectPathService = ObjectPathService = __decorate([
    (0, common_1.Injectable)()
], ObjectPathService);
//# sourceMappingURL=object-path.service.js.map