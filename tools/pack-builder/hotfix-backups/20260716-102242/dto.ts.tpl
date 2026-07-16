import { IsOptional, IsString } from "class-validator";

export class Create{{ENTITY_NAME}}Dto {
{{DTO_FIELDS}}
}

export class Update{{ENTITY_NAME}}Dto extends Create{{ENTITY_NAME}}Dto {}