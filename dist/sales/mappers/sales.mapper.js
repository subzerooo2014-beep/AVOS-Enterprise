"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesMapper = void 0;
class SalesMapper {
    static clean(data) {
        const out = {};
        for (const [key, value] of Object.entries(data ?? {})) {
            if (value !== undefined && value !== null && value !== '') {
                out[key] = value;
            }
        }
        return out;
    }
    static toCreate(dto) {
        return this.clean({
            ...dto,
            number: dto?.number,
            status: dto?.status ?? 'OPEN',
            total: Number(dto?.total ?? 0),
        });
    }
    static toUpdate(dto) {
        return this.clean({
            ...dto,
            total: dto?.total !== undefined ? Number(dto.total) : undefined,
        });
    }
}
exports.SalesMapper = SalesMapper;
//# sourceMappingURL=sales.mapper.js.map