import { PartialType } from "@nestjs/mapped-types";
import { CreateAuctionsDto } from "./create-auctions.dto";

export class UpdateAuctionsDto extends PartialType(CreateAuctionsDto){}
