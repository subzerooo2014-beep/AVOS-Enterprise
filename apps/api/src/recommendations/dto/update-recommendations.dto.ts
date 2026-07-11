import { PartialType } from "@nestjs/mapped-types";
import { CreateRecommendationsDto } from "./create-recommendations.dto";

export class UpdateRecommendationsDto extends PartialType(CreateRecommendationsDto){}
