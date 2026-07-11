import {
  CodeGenJsonValue,
  CodeGenMetadata,
  CodeGenVersion,
} from "../core/codegen.contracts";

export enum CodeGenTemplateType {
  FILE = "file",
  DIRECTORY = "directory",
  PARTIAL = "partial",
  FRAGMENT = "fragment",
  DOCUMENTATION = "documentation",
  CUSTOM = "custom",
}

export enum CodeGenTemplateStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  DISABLED = "disabled",
  ARCHIVED = "archived",
}

export enum CodeGenTemplateSourceType {
  INLINE = "inline",
  FILESYSTEM = "filesystem",
  PLUGIN = "plugin",
  MARKETPLACE = "marketplace",
}

export enum CodeGenTemplateTokenType {
  TEXT = "text",
  VARIABLE = "variable",
  RAW_VARIABLE = "raw_variable",
  HELPER = "helper",
  PARTIAL = "partial",
  IF_OPEN = "if_open",
  UNLESS_OPEN = "unless_open",
  EACH_OPEN = "each_open",
  ELSE = "else",
  BLOCK_CLOSE = "block_close",
}

export interface CodeGenTemplateVariable {
  key: string;
  description?: string;
  required: boolean;
  defaultValue?: CodeGenJsonValue;
}

export interface CodeGenTemplateSource {
  type: CodeGenTemplateSourceType;
  absolutePath?: string;
  relativePath?: string;
  encoding: BufferEncoding;
  checksum?: string;
  loadedAt?: string;
}

export interface CodeGenTemplateDefinition {
  id: string;
  key: string;
  name: string;
  description?: string;
  type: CodeGenTemplateType;
  status: CodeGenTemplateStatus;
  version: CodeGenVersion;
  targetPath: string;
  content: string;
  variables: CodeGenTemplateVariable[];
  tags: string[];
  metadata: CodeGenMetadata;
  source?: CodeGenTemplateSource;
  createdAt: string;
  updatedAt: string;
}

export interface CodeGenTemplateRenderContext {
  variables: Record<string, CodeGenJsonValue>;
  strict: boolean;
  partials?: Record<string, string>;
  metadata?: CodeGenMetadata;
}

export interface CodeGenTemplateToken {
  type: CodeGenTemplateTokenType;
  value: string;
  expression: string;
  position: {
    start: number;
    end: number;
    line: number;
    column: number;
  };
}

export interface CodeGenCompiledTemplate {
  key: string;
  source: string;
  checksum: string;
  tokens: CodeGenTemplateToken[];
  referencedVariables: string[];
  referencedPartials: string[];
  compiledAt: string;
}

export interface CodeGenTemplateRenderDiagnostics {
  missingVariables: string[];
  usedVariables: string[];
  usedPartials: string[];
  warnings: string[];
}

export interface CodeGenRenderedTemplate {
  templateKey: string;
  targetPath: string;
  content: string;
  checksum?: string;
  diagnostics?: CodeGenTemplateRenderDiagnostics;
  renderedAt: string;
}

export interface CodeGenTemplateFileManifest {
  key: string;
  name: string;
  description?: string;
  type?: CodeGenTemplateType;
  status?: CodeGenTemplateStatus;
  version: CodeGenVersion;
  targetPath: string;
  templateFile: string;
  variables?: CodeGenTemplateVariable[];
  tags?: string[];
  metadata?: CodeGenMetadata;
}

export interface CodeGenLoadedTemplate {
  definition: CodeGenTemplateDefinition;
  manifestPath: string;
  templatePath: string;
  checksum: string;
}

export interface CodeGenTemplateDirectoryLoadResult {
  rootPath: string;
  loaded: CodeGenLoadedTemplate[];
  skippedFiles: string[];
  warnings: string[];
  loadedAt: string;
}

export interface CodeGenTemplateCacheEntry {
  key: string;
  checksum: string;
  compiled: CodeGenCompiledTemplate;
  hits: number;
  createdAt: string;
  lastAccessedAt: string;
}

export interface CodeGenTemplateCacheSnapshot {
  size: number;
  hits: number;
  misses: number;
  entries: Array<{
    key: string;
    checksum: string;
    hits: number;
    createdAt: string;
    lastAccessedAt: string;
  }>;
  generatedAt: string;
}
