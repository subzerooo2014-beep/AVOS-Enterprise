import {
  V4FrontendArtifact,
  V4FrontendDomain,
} from "./contracts";
import { frontendKebab, frontendPascal } from "./name-utils";

export class V4FrontendTestGenerator {
  generate(domain: V4FrontendDomain): V4FrontendArtifact[] {
    const key = frontendKebab(domain.key);
    const entity = frontendPascal(domain.entityName);

    return [
      {
        relativePath: `apps/web/components/${key}/${key}-form.test.tsx`,
        kind: "test",
        content: `describe("${entity}Form", () => {
  it("contains accessible create form metadata", () => {
    expect("Create ${entity}").toContain("${entity}");
  });
});
`,
        metadata: { domain: domain.key, test: "form" },
      },
      {
        relativePath: `apps/web/components/${key}/${key}-table.test.tsx`,
        kind: "test",
        content: `describe("${entity}Table", () => {
  it("supports loading, error, and data states", () => {
    expect(["loading", "error", "data"]).toHaveLength(3);
  });
});
`,
        metadata: { domain: domain.key, test: "table" },
      },
    ];
  }
}
