"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorkflowsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_workflows_dto_1 = require("./create-workflows.dto");
class UpdateWorkflowsDto extends (0, mapped_types_1.PartialType)(create_workflows_dto_1.CreateWorkflowsDto) {
}
exports.UpdateWorkflowsDto = UpdateWorkflowsDto;
//# sourceMappingURL=update-workflows.dto.js.map