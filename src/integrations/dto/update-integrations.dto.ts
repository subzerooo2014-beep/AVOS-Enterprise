import { PartialType } from "@nestjs/mapped-types";
import { CreateIntegrationsDto } from "./create-integrations.dto";

export class UpdateIntegrationsDto extends PartialType(CreateIntegrationsDto){}
