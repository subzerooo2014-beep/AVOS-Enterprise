import { PartialType } from "@nestjs/mapped-types";
import { CreateApprovalsDto } from "./create-approvals.dto";

export class UpdateApprovalsDto extends PartialType(CreateApprovalsDto){}
