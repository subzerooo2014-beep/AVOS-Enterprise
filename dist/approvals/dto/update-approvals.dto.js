"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApprovalsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_approvals_dto_1 = require("./create-approvals.dto");
class UpdateApprovalsDto extends (0, mapped_types_1.PartialType)(create_approvals_dto_1.CreateApprovalsDto) {
}
exports.UpdateApprovalsDto = UpdateApprovalsDto;
//# sourceMappingURL=update-approvals.dto.js.map