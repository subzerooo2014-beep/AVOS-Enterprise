import { PartialType } from "@nestjs/mapped-types";
import { CreateBidsDto } from "./create-bids.dto";

export class UpdateBidsDto extends PartialType(CreateBidsDto){}
