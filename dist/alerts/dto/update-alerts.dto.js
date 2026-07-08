"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAlertsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_alerts_dto_1 = require("./create-alerts.dto");
class UpdateAlertsDto extends (0, mapped_types_1.PartialType)(create_alerts_dto_1.CreateAlertsDto) {
}
exports.UpdateAlertsDto = UpdateAlertsDto;
//# sourceMappingURL=update-alerts.dto.js.map