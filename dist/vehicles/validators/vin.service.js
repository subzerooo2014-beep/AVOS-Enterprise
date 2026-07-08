"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VinService = void 0;
class VinService {
    static normalize(vin) {
        return vin.trim().toUpperCase();
    }
    static isValid(vin) {
        return /^[A-HJ-NPR-Z0-9]{17}$/.test(this.normalize(vin));
    }
}
exports.VinService = VinService;
//# sourceMappingURL=vin.service.js.map