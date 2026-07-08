"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmbeddingsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_embeddings_dto_1 = require("./create-embeddings.dto");
class UpdateEmbeddingsDto extends (0, mapped_types_1.PartialType)(create_embeddings_dto_1.CreateEmbeddingsDto) {
}
exports.UpdateEmbeddingsDto = UpdateEmbeddingsDto;
//# sourceMappingURL=update-embeddings.dto.js.map