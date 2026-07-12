import {
  V4FrontendArtifact,
  V4FrontendDomain,
} from "./contracts";
import {
  frontendCamel,
  frontendKebab,
  frontendPascal,
} from "./name-utils";

export class V4FormGenerator {
  generate(domain: V4FrontendDomain): V4FrontendArtifact {
    const key = frontendKebab(domain.key);
    const entity = frontendPascal(domain.entityName);
    const camel = frontendCamel(domain.entityName);

    const initialState = domain.fields
      .map((field) => {
        const value =
          field.type === "number"
            ? "0"
            : field.type === "boolean"
              ? "false"
              : '""';

        return `    ${field.name}: ${value},`;
      })
      .join("\n");

    const controls = domain.fields
      .map((field) => {
        if (field.type === "boolean") {
          return `      <label>
        <input
          type="checkbox"
          checked={form.${field.name}}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              ${field.name}: event.target.checked,
            }))
          }
        />
        ${field.name}
      </label>`;
        }

        const htmlType =
          field.type === "number"
            ? "number"
            : field.type === "date"
              ? "datetime-local"
              : "text";

        const valueExpression =
          field.type === "number"
            ? "Number(event.target.value)"
            : "event.target.value";

        return `      <label>
        ${field.name}
        <input
          type="${htmlType}"
          value={form.${field.name}}
          required={${field.required}}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              ${field.name}: ${valueExpression},
            }))
          }
        />
      </label>`;
      })
      .join("\n\n");

    return {
      relativePath: `apps/web/components/${key}/${key}-form.tsx`,
      kind: "form",
      content: `"use client";

import { FormEvent, useState } from "react";
import {
  ${entity}Dto,
  ${camel}Client,
} from "@/lib/api/${key}.client";

interface Props {
  onCreated?: () => void;
}

export function ${entity}Form({ onCreated }: Props) {
  const [form, setForm] = useState<${entity}Dto>({
${initialState}
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await ${camel}Client.create(form);
      onCreated?.();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to create ${entity}.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} aria-label="Create ${entity}">
${controls}

      {error ? <p role="alert">{error}</p> : null}

      <button disabled={submitting} type="submit">
        {submitting ? "Saving..." : "Create ${entity}"}
      </button>
    </form>
  );
}
`,
      metadata: { domain: domain.key, fields: domain.fields.length },
    };
  }
}
