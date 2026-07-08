"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssistantDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_assistant_dto_1 = require("./create-assistant.dto");
class UpdateAssistantDto extends (0, mapped_types_1.PartialType)(create_assistant_dto_1.CreateAssistantDto) {
}
exports.UpdateAssistantDto = UpdateAssistantDto;
//# sourceMappingURL=update-assistant.dto.js.map