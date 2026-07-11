import { PartialType } from "@nestjs/mapped-types";
import { CreateComparisonsDto } from "./create-comparisons.dto";

export class UpdateComparisonsDto extends PartialType(CreateComparisonsDto){}
