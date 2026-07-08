"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmMapper = void 0;
class CrmMapper {
    static clean(data) {
        const out = {};
        for (const [key, value] of Object.entries(data ?? {})) {
            if (value !== undefined && value !== null && value !== "") {
                out[key] = value;
            }
        }
        return out;
    }
    static toCreate(dto) {
        return this.clean({
            ...dto,
            status: dto?.status ?? "NEW",
        });
    }
    static toUpdate(dto) {
        return this.clean(dto);
    }
}
exports.CrmMapper = CrmMapper;
//# sourceMappingURL=crm.mapper.js.map