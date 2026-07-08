"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesSerializer = void 0;
class SalesSerializer {
    static item(item) {
        if (!item)
            return null;
        return {
            ...item,
            createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
            updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
        };
    }
    static collection(items) {
        return Array.isArray(items) ? items.map((item) => this.item(item)) : [];
    }
}
exports.SalesSerializer = SalesSerializer;
//# sourceMappingURL=sales.serializer.js.map