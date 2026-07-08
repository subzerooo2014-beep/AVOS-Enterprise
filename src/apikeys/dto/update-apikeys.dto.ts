import { PartialType } from "@nestjs/mapped-types";
import { CreateApikeysDto } from "./create-apikeys.dto";

export class UpdateApikeysDto extends PartialType(CreateApikeysDto){}
