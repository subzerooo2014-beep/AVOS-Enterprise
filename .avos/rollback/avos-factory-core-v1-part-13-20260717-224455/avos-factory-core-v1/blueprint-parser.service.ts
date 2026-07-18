import { Injectable } from "@nestjs/common";
import {
  AvosBlueprint,
  ParsedBlueprint
} from "./blueprint.contracts";
import {
  BlueprintParsingError
} from "./blueprint.errors";

@Injectable()
export class BlueprintParserService {
  parse(
    source: AvosBlueprint | string
  ): ParsedBlueprint {
    if (typeof source === "string") {
      return {
        blueprint:
          this.parseJson(source),
        sourceType: "json",
        parsedAt:
          new Date().toISOString()
      };
    }

    if (
      !source ||
      typeof source !== "object"
    ) {
      throw new BlueprintParsingError(
        "Blueprint source must be an object or JSON string."
      );
    }

    return {
      blueprint:
        structuredClone(source),
      sourceType: "object",
      parsedAt:
        new Date().toISOString()
    };
  }

  private parseJson(
    source: string
  ): AvosBlueprint {
    if (
      source.trim().length === 0
    ) {
      throw new BlueprintParsingError(
        "Blueprint JSON source cannot be empty."
      );
    }

    try {
      const parsed: unknown =
        JSON.parse(source);

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        throw new BlueprintParsingError(
          "Blueprint JSON must represent an object."
        );
      }

      return parsed as AvosBlueprint;
    } catch (error) {
      if (
        error instanceof
        BlueprintParsingError
      ) {
        throw error;
      }

      throw new BlueprintParsingError(
        error instanceof Error
          ? `Blueprint JSON parsing failed: ${error.message}`
          : "Blueprint JSON parsing failed."
      );
    }
  }
}
