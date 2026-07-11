import { PartialType } from "@nestjs/mapped-types";
import { CreateAiagentsDto } from "./create-aiagents.dto";

export class UpdateAiagentsDto extends PartialType(CreateAiagentsDto){}
