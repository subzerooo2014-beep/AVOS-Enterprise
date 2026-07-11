import { randomUUID } from "node:crypto";
import {
  SystemGenerationRequest,
} from "./contracts";

export class SystemGenerationRequestFactory {
  create(
    input: Omit<
      SystemGenerationRequest,
      "id" | "createdAt"
    >,
  ): SystemGenerationRequest {
    return {
      ...structuredClone(input),
      id: randomUUID(),
      createdAt:
        new Date().toISOString(),
    };
  }
}
