"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComparisonsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_comparisons_dto_1 = require("./create-comparisons.dto");
class UpdateComparisonsDto extends (0, mapped_types_1.PartialType)(create_comparisons_dto_1.CreateComparisonsDto) {
}
exports.UpdateComparisonsDto = UpdateComparisonsDto;
//# sourceMappingURL=update-comparisons.dto.js.map