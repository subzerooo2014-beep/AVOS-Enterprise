"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCrmDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_crm_dto_1 = require("./create-crm.dto");
class UpdateCrmDto extends (0, mapped_types_1.PartialType)(create_crm_dto_1.CreateCrmDto) {
}
exports.UpdateCrmDto = UpdateCrmDto;
//# sourceMappingURL=update-crm.dto.js.map