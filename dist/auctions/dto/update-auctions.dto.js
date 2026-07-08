"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAuctionsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_auctions_dto_1 = require("./create-auctions.dto");
class UpdateAuctionsDto extends (0, mapped_types_1.PartialType)(create_auctions_dto_1.CreateAuctionsDto) {
}
exports.UpdateAuctionsDto = UpdateAuctionsDto;
//# sourceMappingURL=update-auctions.dto.js.map