import {
  CodeGenTemplateDefinition,
  CodeGenTemplateStatus,
  CodeGenTemplateType,
} from "../codegen-template.contracts";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";

export interface CodeGenTemplateCatalogQuery {
  status?: CodeGenTemplateStatus;
  type?: CodeGenTemplateType;
  tags?: string[];
  text?: string;
}

export class CodeGenTemplateCatalog {
  private readonly templates =
    new Map<
      string,
      CodeGenTemplateDefinition
    >();

  register(
    template: CodeGenTemplateDefinition,
    replace = false,
  ): CodeGenTemplateDefinition {
    const key =
      template.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Template catalog key is required",
      );
    }

    if (
      this.templates.has(key) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Template catalog entry already exists: ${key}`,
      );
    }

    this.templates.set(
      key,
      structuredClone(template),
    );

    return structuredClone(template);
  }

  registerMany(
    templates:
      readonly CodeGenTemplateDefinition[],
    replace = false,
  ): CodeGenTemplateDefinition[] {
    return templates.map(
      (template) =>
        this.register(
          template,
          replace,
        ),
    );
  }

  get(
    key: string,
  ): CodeGenTemplateDefinition {
    const template =
      this.templates.get(key);

    if (!template) {
      throw new CodeGenValidationError(
        `Template catalog entry was not found: ${key}`,
      );
    }

    return structuredClone(template);
  }

  find(
    key: string,
  ): CodeGenTemplateDefinition | undefined {
    const template =
      this.templates.get(key);

    return template
      ? structuredClone(template)
      : undefined;
  }

  query(
    query:
      CodeGenTemplateCatalogQuery = {},
  ): CodeGenTemplateDefinition[] {
    const normalizedText =
      query.text
        ?.trim()
        .toLowerCase();

    return Array.from(
      this.templates.values(),
    )
      .filter((template) => {
        if (
          query.status &&
          template.status !==
            query.status
        ) {
          return false;
        }

        if (
          query.type &&
          template.type !==
            query.type
        ) {
          return false;
        }

        if (
          query.tags?.length &&
          !query.tags.every((tag) =>
            template.tags.includes(tag),
          )
        ) {
          return false;
        }

        if (normalizedText) {
          const searchable = [
            template.key,
            template.name,
            template.description ?? "",
            template.targetPath,
            ...template.tags,
          ]
            .join(" ")
            .toLowerCase();

          if (
            !searchable.includes(
              normalizedText,
            )
          ) {
            return false;
          }
        }

        return true;
      })
      .map((template) =>
        structuredClone(template),
      )
      .sort((left, right) =>
        left.key.localeCompare(
          right.key,
        ),
      );
  }

  listActive():
    CodeGenTemplateDefinition[] {
    return this.query({
      status:
        CodeGenTemplateStatus.ACTIVE,
    });
  }

  remove(
    key: string,
  ): CodeGenTemplateDefinition {
    const template =
      this.get(key);

    this.templates.delete(key);

    return template;
  }

  count(): number {
    return this.templates.size;
  }

  clear(): void {
    this.templates.clear();
  }
}
