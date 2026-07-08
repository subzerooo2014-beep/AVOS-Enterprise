"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePromptsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_prompts_dto_1 = require("./create-prompts.dto");
class UpdatePromptsDto extends (0, mapped_types_1.PartialType)(create_prompts_dto_1.CreatePromptsDto) {
}
exports.UpdatePromptsDto = UpdatePromptsDto;
//# sourceMappingURL=update-prompts.dto.js.map