import { PartialType } from "@nestjs/mapped-types";
import { CreateWorkflowsDto } from "./create-workflows.dto";

export class UpdateWorkflowsDto extends PartialType(CreateWorkflowsDto){}
