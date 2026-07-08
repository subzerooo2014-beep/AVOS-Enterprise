"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWebhooksDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_webhooks_dto_1 = require("./create-webhooks.dto");
class UpdateWebhooksDto extends (0, mapped_types_1.PartialType)(create_webhooks_dto_1.CreateWebhooksDto) {
}
exports.UpdateWebhooksDto = UpdateWebhooksDto;
//# sourceMappingURL=update-webhooks.dto.js.map