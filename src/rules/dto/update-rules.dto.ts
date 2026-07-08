import { PartialType } from "@nestjs/mapped-types";
import { CreateRulesDto } from "./create-rules.dto";

export class UpdateRulesDto extends PartialType(CreateRulesDto){}
