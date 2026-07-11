"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersMapper = void 0;
class CustomersMapper {
    static toResponse(entity) {
        if (!entity)
            return null;
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            phone: entity.phone,
            company: entity.company,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    static toResponseList(items = []) {
        return items.map((item) => this.toResponse(item));
    }
    static toCreate(data) {
        return {
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
            status: data.status,
        };
    }
    static toUpdate(data) {
        return {
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
            status: data.status,
        };
    }
}
exports.CustomersMapper = CustomersMapper;
//# sourceMappingURL=customers.mapper.js.map