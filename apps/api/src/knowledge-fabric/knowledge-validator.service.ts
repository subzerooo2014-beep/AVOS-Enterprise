import { BadRequestException, Injectable } from "@nestjs/common";
import {
  RegisterKnowledgeInput,
  UpdateKnowledgeInput,
} from "./knowledge.types";

@Injectable()
export class KnowledgeValidatorService {
  validateRegistration(input: RegisterKnowledgeInput): void {
    if (!input.key?.trim()) {
      throw new BadRequestException("Knowledge key is required.");
    }

    if (!/^[a-z0-9][a-z0-9._:-]*$/i.test(input.key)) {
      throw new BadRequestException(
        "Knowledge key contains unsupported characters.",
      );
    }

    if (!input.name?.trim()) {
      throw new BadRequestException("Knowledge name is required.");
    }

    if (!input.purpose?.trim()) {
      throw new BadRequestException("Knowledge purpose is required.");
    }

    if (!input.createdBy?.trim()) {
      throw new BadRequestException("Knowledge creator is required.");
    }

    if (typeof input.content === "undefined") {
      throw new BadRequestException("Knowledge content is required.");
    }
  }

  validateUpdate(input: UpdateKnowledgeInput): void {
    if (!input.updatedBy?.trim()) {
      throw new BadRequestException("Knowledge updater is required.");
    }

    if (!input.reason?.trim()) {
      throw new BadRequestException("Knowledge update reason is required.");
    }

    if (typeof input.content === "undefined") {
      throw new BadRequestException("Updated knowledge content is required.");
    }
  }
}