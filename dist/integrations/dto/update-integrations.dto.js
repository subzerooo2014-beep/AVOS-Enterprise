"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIntegrationsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_integrations_dto_1 = require("./create-integrations.dto");
class UpdateIntegrationsDto extends (0, mapped_types_1.PartialType)(create_integrations_dto_1.CreateIntegrationsDto) {
}
exports.UpdateIntegrationsDto = UpdateIntegrationsDto;
//# sourceMappingURL=update-integrations.dto.js.map