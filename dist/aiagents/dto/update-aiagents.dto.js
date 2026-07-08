"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAiagentsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_aiagents_dto_1 = require("./create-aiagents.dto");
class UpdateAiagentsDto extends (0, mapped_types_1.PartialType)(create_aiagents_dto_1.CreateAiagentsDto) {
}
exports.UpdateAiagentsDto = UpdateAiagentsDto;
//# sourceMappingURL=update-aiagents.dto.js.map