import {
  createHash,
  randomUUID,
} from "node:crypto";
import {
  readdir,
  readFile,
  stat,
} from "node:fs/promises";
import {
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from "node:path";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenLoadedTemplate,
  CodeGenTemplateDefinition,
  CodeGenTemplateDirectoryLoadResult,
  CodeGenTemplateFileManifest,
  CodeGenTemplateSourceType,
  CodeGenTemplateStatus,
  CodeGenTemplateType,
} from "../codegen-template.contracts";

export interface LoadTemplateManifestOptions {
  replaceRoot?: string;
  encoding?: BufferEncoding;
}

export class CodeGenTemplateLoader {
  async loadManifest(
    manifestPath: string,
    options:
      LoadTemplateManifestOptions = {},
  ): Promise<CodeGenLoadedTemplate> {
    const absoluteManifestPath =
      resolve(manifestPath);

    const rawManifest =
      await readFile(
        absoluteManifestPath,
        "utf8",
      );

    const parsed: unknown =
      JSON.parse(rawManifest);

    const manifest =
      this.validateManifest(
        parsed,
        absoluteManifestPath,
      );

    const manifestDirectory =
      dirname(absoluteManifestPath);

    const absoluteTemplatePath =
      isAbsolute(manifest.templateFile)
        ? manifest.templateFile
        : resolve(
            manifestDirectory,
            manifest.templateFile,
          );

    const encoding =
      options.encoding ?? "utf8";

    const content =
      await readFile(
        absoluteTemplatePath,
        encoding,
      );

    const checksum =
      createHash("sha256")
        .update(content)
        .digest("hex");

    const fileStat =
      await stat(
        absoluteTemplatePath,
      );

    const now =
      new Date().toISOString();

    const sourceRoot =
      options.replaceRoot
        ? resolve(options.replaceRoot)
        : manifestDirectory;

    const definition:
      CodeGenTemplateDefinition = {
      id: randomUUID(),
      key: manifest.key.trim(),
      name: manifest.name.trim(),
      ...(manifest.description
        ? {
            description:
              manifest.description,
          }
        : {}),
      type:
        manifest.type ??
        CodeGenTemplateType.FILE,
      status:
        manifest.status ??
        CodeGenTemplateStatus.ACTIVE,
      version:
        structuredClone(
          manifest.version,
        ),
      targetPath:
        manifest.targetPath,
      content,
      variables:
        structuredClone(
          manifest.variables ?? [],
        ),
      tags:
        Array.from(
          new Set(
            manifest.tags ?? [],
          ),
        ),
      metadata:
        structuredClone(
          manifest.metadata ?? {},
        ),
      source: {
        type:
          CodeGenTemplateSourceType.FILESYSTEM,
        absolutePath:
          absoluteTemplatePath,
        relativePath:
          relative(
            sourceRoot,
            absoluteTemplatePath,
          ),
        encoding,
        checksum,
        loadedAt: now,
      },
      createdAt:
        fileStat.birthtime.toISOString(),
      updatedAt:
        fileStat.mtime.toISOString(),
    };

    return {
      definition,
      manifestPath:
        absoluteManifestPath,
      templatePath:
        absoluteTemplatePath,
      checksum,
    };
  }

  async loadDirectory(
    rootPath: string,
  ): Promise<
    CodeGenTemplateDirectoryLoadResult
  > {
    const absoluteRoot =
      resolve(rootPath);

    const files =
      await this.walk(
        absoluteRoot,
      );

    const manifestFiles =
      files
        .filter((file) =>
          file.endsWith(
            ".template.json",
          ),
        )
        .sort();

    const loaded:
      CodeGenLoadedTemplate[] = [];

    const skippedFiles =
      files.filter(
        (file) =>
          !file.endsWith(
            ".template.json",
          ),
      );

    const warnings: string[] = [];

    for (
      const manifestFile of
      manifestFiles
    ) {
      try {
        loaded.push(
          await this.loadManifest(
            manifestFile,
            {
              replaceRoot:
                absoluteRoot,
            },
          ),
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : String(error);

        warnings.push(
          `${manifestFile}: ${message}`,
        );
      }
    }

    return {
      rootPath:
        absoluteRoot,
      loaded,
      skippedFiles,
      warnings,
      loadedAt:
        new Date().toISOString(),
    };
  }

  private validateManifest(
    value: unknown,
    manifestPath: string,
  ): CodeGenTemplateFileManifest {
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      throw new CodeGenValidationError(
        `Template manifest must be a JSON object: ${manifestPath}`,
      );
    }

    const record =
      value as Record<
        string,
        unknown
      >;

    const requiredStrings = [
      "key",
      "name",
      "targetPath",
      "templateFile",
    ];

    for (
      const key of
      requiredStrings
    ) {
      if (
        typeof record[key] !==
          "string" ||
        !(record[key] as string)
          .trim()
      ) {
        throw new CodeGenValidationError(
          `Template manifest property is required: ${key} in ${manifestPath}`,
        );
      }
    }

    if (
      !record["version"] ||
      typeof record["version"] !==
        "object" ||
      Array.isArray(
        record["version"],
      )
    ) {
      throw new CodeGenValidationError(
        `Template manifest version is required: ${manifestPath}`,
      );
    }

    return value as
      CodeGenTemplateFileManifest;
  }

  private async walk(
    directory: string,
  ): Promise<string[]> {
    const entries =
      await readdir(
        directory,
        {
          withFileTypes: true,
        },
      );

    const files: string[] = [];

    for (const entry of entries) {
      const absolutePath =
        join(
          directory,
          entry.name,
        );

      if (entry.isDirectory()) {
        files.push(
          ...await this.walk(
            absolutePath,
          ),
        );
      } else if (
        entry.isFile()
      ) {
        files.push(
          absolutePath,
        );
      }
    }

    return files;
  }
}
