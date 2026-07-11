"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersSerializer = void 0;
class CustomersSerializer {
    static serialize(data) {
        if (!data)
            return null;
        return {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
            status: data.status,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }
    static serializeMany(items = []) {
        return items.map((item) => this.serialize(item));
    }
    static serializePagination(result) {
        return {
            data: this.serializeMany(result.data ?? []),
            meta: {
                total: result.total ?? 0,
                page: result.page ?? 1,
                limit: result.limit ?? 20,
                totalPages: result.totalPages ?? 1,
            },
        };
    }
}
exports.CustomersSerializer = CustomersSerializer;
//# sourceMappingURL=customers.serializer.js.map