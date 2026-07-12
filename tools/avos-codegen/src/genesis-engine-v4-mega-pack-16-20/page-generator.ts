import {
  V4FrontendArtifact,
  V4FrontendDomain,
} from "./contracts";
import { frontendKebab, frontendPascal } from "./name-utils";

export class V4PageGenerator {
  generate(domain: V4FrontendDomain): V4FrontendArtifact[] {
    const key = frontendKebab(domain.key);
    const entity = frontendPascal(domain.entityName);

    return [
      {
        relativePath: `apps/web/app/${key}/page.tsx`,
        kind: "page",
        content: `import { ${entity}Form } from "@/components/${key}/${key}-form";
import { ${entity}Table } from "@/components/${key}/${key}-table";

export default function ${entity}Page() {
  return (
    <main>
      <header>
        <h1>${entity}</h1>
        <p>Manage ${entity} records.</p>
      </header>

      <${entity}Form />
      <${entity}Table />
    </main>
  );
}
`,
        metadata: { domain: domain.key, page: "list-create" },
      },
      {
        relativePath: `apps/web/app/${key}/loading.tsx`,
        kind: "state",
        content: `export default function Loading() {
  return <p>Loading ${entity}...</p>;
}
`,
        metadata: { domain: domain.key, state: "loading" },
      },
      {
        relativePath: `apps/web/app/${key}/error.tsx`,
        kind: "state",
        content: `"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section role="alert">
      <h2>Unable to load ${entity}</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </section>
  );
}
`,
        metadata: { domain: domain.key, state: "error" },
      },
    ];
  }
}
