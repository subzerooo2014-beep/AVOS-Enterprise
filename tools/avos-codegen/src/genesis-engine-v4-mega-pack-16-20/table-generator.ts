import {
  V4FrontendArtifact,
  V4FrontendDomain,
} from "./contracts";
import {
  frontendCamel,
  frontendKebab,
  frontendPascal,
} from "./name-utils";

export class V4TableGenerator {
  generate(
    domain: V4FrontendDomain,
    enableSearch: boolean,
  ): V4FrontendArtifact {
    const key = frontendKebab(domain.key);
    const entity = frontendPascal(domain.entityName);
    const camel = frontendCamel(domain.entityName);

    const headers = domain.fields
      .map((field) => `          <th>${field.name}</th>`)
      .join("\n");

    const cells = domain.fields
      .map(
        (field) =>
          `            <td>{String(item.${field.name} ?? "")}</td>`,
      )
      .join("\n");

    const searchState = enableSearch
      ? `  const [query, setQuery] = useState("");

  const filtered = items.filter((item) =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
`
      : `  const filtered = items;\n`;

    const searchControl = enableSearch
      ? `      <input
        aria-label="Search ${entity}"
        placeholder="Search..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
`
      : "";

    return {
      relativePath: `apps/web/components/${key}/${key}-table.tsx`,
      kind: "table",
      content: `"use client";

import { useEffect, useState } from "react";
import {
  ${entity}Record,
  ${camel}Client,
} from "@/lib/api/${key}.client";

export function ${entity}Table() {
  const [items, setItems] = useState<${entity}Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
${searchState}
  async function load() {
    setLoading(true);
    setError(null);

    try {
      setItems(await ${camel}Client.list());
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load ${entity}.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <section>
${searchControl}      <table>
        <thead>
          <tr>
${headers}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
          <tr key={item.id}>
${cells}
            <td>
              <button
                onClick={async () => {
                  await ${camel}Client.remove(item.id);
                  await load();
                }}
              >
                Delete
              </button>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
`,
      metadata: {
        domain: domain.key,
        searchable: enableSearch,
      },
    };
  }
}
