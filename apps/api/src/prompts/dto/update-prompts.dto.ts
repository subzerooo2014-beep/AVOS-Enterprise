import { PartialType } from "@nestjs/mapped-types";
import { CreatePromptsDto } from "./create-prompts.dto";

export class UpdatePromptsDto extends PartialType(CreatePromptsDto){}
