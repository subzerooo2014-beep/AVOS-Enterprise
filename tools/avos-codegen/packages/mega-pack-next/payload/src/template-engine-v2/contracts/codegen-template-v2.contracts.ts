export type CodeGenTemplatePrimitive =
  | string
  | number
  | boolean
  | null;

export type CodeGenTemplateValue =
  | CodeGenTemplatePrimitive
  | CodeGenTemplateValue[]
  | {
      [key: string]:
        CodeGenTemplateValue;
    };

export enum CodeGenTemplateTokenType {
  TEXT = "text",
  INTERPOLATION = "interpolation",
  IF_OPEN = "if_open",
  IF_CLOSE = "if_close",
  EACH_OPEN = "each_open",
  EACH_CLOSE = "each_close",
  COMMENT = "comment",
}

export interface CodeGenTemplateToken {
  type: CodeGenTemplateTokenType;
  raw: string;
  expression?: string;
  start: number;
  end: number;
  line: number;
  column: number;
}

export enum CodeGenTemplateAstNodeType {
  DOCUMENT = "document",
  TEXT = "text",
  INTERPOLATION = "interpolation",
  IF = "if",
  EACH = "each",
  COMMENT = "comment",
}

export interface CodeGenTemplateAstBase {
  type: CodeGenTemplateAstNodeType;
  start: number;
  end: number;
}

export interface CodeGenTemplateDocumentNode
  extends CodeGenTemplateAstBase {
  type:
    CodeGenTemplateAstNodeType.DOCUMENT;
  children:
    CodeGenTemplateAstNode[];
}

export interface CodeGenTemplateTextNode
  extends CodeGenTemplateAstBase {
  type:
    CodeGenTemplateAstNodeType.TEXT;
  value: string;
}

export interface CodeGenTemplateInterpolationNode
  extends CodeGenTemplateAstBase {
  type:
    CodeGenTemplateAstNodeType.INTERPOLATION;
  expression: string;
}

export interface CodeGenTemplateIfNode
  extends CodeGenTemplateAstBase {
  type:
    CodeGenTemplateAstNodeType.IF;
  expression: string;
  children:
    CodeGenTemplateAstNode[];
}

export interface CodeGenTemplateEachNode
  extends CodeGenTemplateAstBase {
  type:
    CodeGenTemplateAstNodeType.EACH;
  expression: string;
  alias: string;
  children:
    CodeGenTemplateAstNode[];
}

export interface CodeGenTemplateCommentNode
  extends CodeGenTemplateAstBase {
  type:
    CodeGenTemplateAstNodeType.COMMENT;
  value: string;
}

export type CodeGenTemplateAstNode =
  | CodeGenTemplateDocumentNode
  | CodeGenTemplateTextNode
  | CodeGenTemplateInterpolationNode
  | CodeGenTemplateIfNode
  | CodeGenTemplateEachNode
  | CodeGenTemplateCommentNode;

export interface CodeGenTemplateCompileRequest {
  templateKey: string;
  source: string;
  variables:
    Record<
      string,
      CodeGenTemplateValue
    >;
  strict: boolean;
  preserveComments: boolean;
}

export interface CodeGenTemplateCompileResult {
  success: boolean;
  templateKey: string;
  output: string;
  tokens:
    CodeGenTemplateToken[];
  ast:
    CodeGenTemplateDocumentNode;
  diagnostics:
    CodeGenTemplateDiagnostic[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

export enum CodeGenTemplateDiagnosticSeverity {
  INFORMATIONAL = "informational",
  WARNING = "warning",
  ERROR = "error",
}

export interface CodeGenTemplateDiagnostic {
  code: string;
  severity:
    CodeGenTemplateDiagnosticSeverity;
  message: string;
  line?: number;
  column?: number;
  expression?: string;
}
