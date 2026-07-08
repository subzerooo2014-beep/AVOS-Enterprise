"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSchedulerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_scheduler_dto_1 = require("./create-scheduler.dto");
class UpdateSchedulerDto extends (0, mapped_types_1.PartialType)(create_scheduler_dto_1.CreateSchedulerDto) {
}
exports.UpdateSchedulerDto = UpdateSchedulerDto;
//# sourceMappingURL=update-scheduler.dto.js.map