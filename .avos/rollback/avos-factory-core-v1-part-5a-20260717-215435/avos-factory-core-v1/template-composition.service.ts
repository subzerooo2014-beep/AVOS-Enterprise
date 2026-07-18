import { Injectable } from "@nestjs/common";
import {
  AvosTemplate,
  TemplateCompositionRequest
} from "./template.contracts";
import {
  TemplateRegistryService
} from "./template-registry.service";
import {
  TemplateCompositionError
} from "./template.errors";

@Injectable()
export class TemplateCompositionService {
  constructor(
    private readonly registry:
      TemplateRegistryService
  ) {}

  compose(
    request: TemplateCompositionRequest
  ): AvosTemplate {
    let content = request.content;

    for (
      const partialId
      of request.partialTemplateIds
    ) {
      const partial =
        this.registry.get(partialId);

      const placeholder =
        `{{> ${partialId}}}`;

      if (
        !content.includes(placeholder)
      ) {
        throw new TemplateCompositionError(
          `Composition placeholder "${placeholder}" was not found.`
        );
      }

      content =
        content.split(placeholder)
          .join(partial.content);
    }

    return {
      id: request.id,
      name: request.name,
      version: request.version,
      format: request.format,
      status: "draft",
      content,
      variables:
        structuredClone(
          request.variables ?? []
        ),
      partials: [
        ...request.partialTemplateIds
      ],
      metadata: {
        createdBy:
          request.createdBy,
        createdAt:
          new Date().toISOString(),
        humanFinalAuthority: true,
        description:
          "Composed by AVOS Template Engine"
      }
    };
  }
}
