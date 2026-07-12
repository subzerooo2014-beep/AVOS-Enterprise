import {
  V4FrontendArtifact,
  V4FrontendDomain,
} from "./contracts";
import {
  frontendCamel,
  frontendKebab,
  frontendPascal,
} from "./name-utils";

export class V4ApiClientGenerator {
  generate(domain: V4FrontendDomain): V4FrontendArtifact {
    const key = frontendKebab(domain.key);
    const entity = frontendPascal(domain.entityName);
    const camel = frontendCamel(domain.entityName);

    const fields = domain.fields
      .map((field) => {
        const type =
          field.type === "number"
            ? "number"
            : field.type === "boolean"
              ? "boolean"
              : "string";

        return `  ${field.name}${field.required ? "" : "?"}: ${type};`;
      })
      .join("\n");

    return {
      relativePath: `apps/web/lib/api/${key}.client.ts`,
      kind: "api-client",
      content: `export interface ${entity}Dto {
${fields}
}

export interface ${entity}Record extends ${entity}Dto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(\`\${baseUrl}\${path}\`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(
      \`API request failed with status \${response.status}\`,
    );
  }

  return response.json() as Promise<T>;
}

export const ${camel}Client = {
  list: () => request<${entity}Record[]>("/${key}"),
  get: (id: string) =>
    request<${entity}Record>(\`/${key}/\${id}\`),
  create: (input: ${entity}Dto) =>
    request<${entity}Record>("/${key}", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: Partial<${entity}Dto>) =>
    request<${entity}Record>(\`/${key}/\${id}\`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<{ success: boolean }>(\`/${key}/\${id}\`, {
      method: "DELETE",
    }),
};
`,
      metadata: { domain: domain.key },
    };
  }
}
