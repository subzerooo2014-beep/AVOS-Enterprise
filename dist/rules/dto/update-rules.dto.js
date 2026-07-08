"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRulesDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_rules_dto_1 = require("./create-rules.dto");
class UpdateRulesDto extends (0, mapped_types_1.PartialType)(create_rules_dto_1.CreateRulesDto) {
}
exports.UpdateRulesDto = UpdateRulesDto;
//# sourceMappingURL=update-rules.dto.js.map