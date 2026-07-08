"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBidsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_bids_dto_1 = require("./create-bids.dto");
class UpdateBidsDto extends (0, mapped_types_1.PartialType)(create_bids_dto_1.CreateBidsDto) {
}
exports.UpdateBidsDto = UpdateBidsDto;
//# sourceMappingURL=update-bids.dto.js.map