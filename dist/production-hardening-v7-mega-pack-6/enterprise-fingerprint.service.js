"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseFingerprintService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let EnterpriseFingerprintService = class EnterpriseFingerprintService {
    create(value) {
        return (0, node_crypto_1.createHash)("sha256")
            .update(this.stableStringify(value))
            .digest("hex");
    }
    stableStringify(value) {
        if (value === null ||
            typeof value !== "object") {
            return JSON.stringify(value);
        }
        if (Array.isArray(value)) {
            return `[${value
                .map((item) => this.stableStringify(item))
                .join(",")}]`;
        }
        const record = value;
        return `{${Object.keys(record)
            .sort()
            .map((key) => `${JSON.stringify(key)}:${this.stableStringify(record[key])}`)
            .join(",")}}`;
    }
};
exports.EnterpriseFingerprintService = EnterpriseFingerprintService;
exports.EnterpriseFingerprintService = EnterpriseFingerprintService = __decorate([
    (0, common_1.Injectable)()
], EnterpriseFingerprintService);
//# sourceMappingURL=enterprise-fingerprint.service.js.map