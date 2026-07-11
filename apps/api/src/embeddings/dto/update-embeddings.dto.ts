import { PartialType } from "@nestjs/mapped-types";
import { CreateEmbeddingsDto } from "./create-embeddings.dto";

export class UpdateEmbeddingsDto extends PartialType(CreateEmbeddingsDto){}
