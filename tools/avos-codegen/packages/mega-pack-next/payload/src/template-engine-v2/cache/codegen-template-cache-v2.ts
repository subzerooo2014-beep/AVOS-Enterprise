import {
  createHash,
} from "node:crypto";
import {
  CodeGenTemplateDocumentNode,
} from "../contracts/codegen-template-v2.contracts";

export interface CodeGenTemplateCacheEntryV2 {
  key: string;
  sourceHash: string;
  ast:
    CodeGenTemplateDocumentNode;
  createdAt: string;
  updatedAt: string;
  hits: number;
}

export class CodeGenTemplateCacheV2 {
  private readonly entries =
    new Map<
      string,
      CodeGenTemplateCacheEntryV2
    >();

  hash(
    source: string,
  ): string {
    return createHash(
      "sha256",
    )
      .update(source)
      .digest("hex");
  }

  get(
    key: string,
    source: string,
  ):
    CodeGenTemplateDocumentNode |
    undefined {
    const entry =
      this.entries.get(key);

    if (
      !entry ||
      entry.sourceHash !==
        this.hash(source)
    ) {
      return undefined;
    }

    entry.hits += 1;
    entry.updatedAt =
      new Date().toISOString();

    return structuredClone(
      entry.ast,
    );
  }

  put(
    key: string,
    source: string,
    ast:
      CodeGenTemplateDocumentNode,
  ): CodeGenTemplateCacheEntryV2 {
    const now =
      new Date().toISOString();

    const existing =
      this.entries.get(key);

    const entry:
      CodeGenTemplateCacheEntryV2 = {
      key,
      sourceHash:
        this.hash(source),
      ast:
        structuredClone(ast),
      createdAt:
        existing?.createdAt ??
        now,
      updatedAt:
        now,
      hits:
        existing?.hits ??
        0,
    };

    this.entries.set(
      key,
      entry,
    );

    return structuredClone(
      entry,
    );
  }

  stats() {
    const values =
      Array.from(
        this.entries.values(),
      );

    return {
      entries:
        values.length,
      hits:
        values.reduce(
          (
            total,
            entry,
          ) =>
            total + entry.hits,
          0,
        ),
      generatedAt:
        new Date().toISOString(),
    };
  }

  clear(): void {
    this.entries.clear();
  }
}
