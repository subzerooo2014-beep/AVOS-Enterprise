import { PartialType } from "@nestjs/mapped-types";
import { CreateListingsDto } from "./create-listings.dto";

export class UpdateListingsDto extends PartialType(CreateListingsDto){}
