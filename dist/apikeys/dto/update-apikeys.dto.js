"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApikeysDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_apikeys_dto_1 = require("./create-apikeys.dto");
class UpdateApikeysDto extends (0, mapped_types_1.PartialType)(create_apikeys_dto_1.CreateApikeysDto) {
}
exports.UpdateApikeysDto = UpdateApikeysDto;
//# sourceMappingURL=update-apikeys.dto.js.map