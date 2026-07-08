"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRecommendationsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_recommendations_dto_1 = require("./create-recommendations.dto");
class UpdateRecommendationsDto extends (0, mapped_types_1.PartialType)(create_recommendations_dto_1.CreateRecommendationsDto) {
}
exports.UpdateRecommendationsDto = UpdateRecommendationsDto;
//# sourceMappingURL=update-recommendations.dto.js.map