"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVisionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_vision_dto_1 = require("./create-vision.dto");
class UpdateVisionDto extends (0, mapped_types_1.PartialType)(create_vision_dto_1.CreateVisionDto) {
}
exports.UpdateVisionDto = UpdateVisionDto;
//# sourceMappingURL=update-vision.dto.js.map