"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRagDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_rag_dto_1 = require("./create-rag.dto");
class UpdateRagDto extends (0, mapped_types_1.PartialType)(create_rag_dto_1.CreateRagDto) {
}
exports.UpdateRagDto = UpdateRagDto;
//# sourceMappingURL=update-rag.dto.js.map