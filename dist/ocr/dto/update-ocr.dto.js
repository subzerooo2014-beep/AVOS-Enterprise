"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOcrDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ocr_dto_1 = require("./create-ocr.dto");
class UpdateOcrDto extends (0, mapped_types_1.PartialType)(create_ocr_dto_1.CreateOcrDto) {
}
exports.UpdateOcrDto = UpdateOcrDto;
//# sourceMappingURL=update-ocr.dto.js.map