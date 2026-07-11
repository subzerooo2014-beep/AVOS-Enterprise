"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersMapper = void 0;
const common_1 = require("@nestjs/common");
let SuppliersMapper = class SuppliersMapper {
    toCreateData(dto) {
        return {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            address: dto.address,
            notes: dto.notes,
        };
    }
    toUpdateData(dto) {
        return {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            address: dto.address,
            notes: dto.notes,
        };
    }
};
exports.SuppliersMapper = SuppliersMapper;
exports.SuppliersMapper = SuppliersMapper = __decorate([
    (0, common_1.Injectable)()
], SuppliersMapper);
//# sourceMappingURL=suppliers.mapper.js.map