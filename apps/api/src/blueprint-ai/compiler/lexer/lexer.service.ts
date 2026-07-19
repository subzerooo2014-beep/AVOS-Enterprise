import { Injectable } from "@nestjs/common";

export type BlueprintLexemeType =
  | "Identifier"
  | "Number"
  | "String"
  | "Punctuation"
  | "Keyword";

export interface BlueprintLexeme {
  type: BlueprintLexemeType;
  value: string;
  index: number;
}

export interface LexerExecutionInput {
  tokens?: string[];
  input?: string;
}

export interface LexerExecutionResult {
  component: "lexer";
  lexemes: BlueprintLexeme[];
  lexemeCount: number;
  executedAt: string;
}

@Injectable()
export class LexerService {
  private readonly keywords = new Set([
    "create",
    "build",
    "generate",
    "system",
    "application",
    "platform",
    "entity",
    "entities",
    "with",
    "and",
    "has",
    "have",
    "requires",
    "workflow",
    "api",
    "dashboard",
  ]);

  lex(tokens: string[]): BlueprintLexeme[] {
    if (!Array.isArray(tokens)) {
      throw new TypeError("Lexer tokens must be an array.");
    }

    return tokens.map((token, index) => ({
      type: this.classify(token),
      value: token,
      index,
    }));
  }

  execute(body: LexerExecutionInput | string[]): LexerExecutionResult {
    const tokens = this.resolveTokens(body);
    const lexemes = this.lex(tokens);

    return {
      component: "lexer",
      lexemes,
      lexemeCount: lexemes.length,
      executedAt: new Date().toISOString(),
    };
  }

  private resolveTokens(body: LexerExecutionInput | string[]): string[] {
    if (Array.isArray(body)) {
      return body;
    }

    if (Array.isArray(body?.tokens)) {
      return body.tokens;
    }

    if (typeof body?.input === "string") {
      return body.input
        .normalize("NFKC")
        .replace(/([.,;:!?()[\]{}])/g, " $1 ")
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(Boolean);
    }

    throw new Error("Lexer requires a tokens array or a non-empty input string.");
  }

  private classify(token: string): BlueprintLexemeType {
    if (/^[.,;:!?()[\]{}]$/.test(token)) {
      return "Punctuation";
    }

    if (/^-?\d+(\.\d+)?$/.test(token)) {
      return "Number";
    }

    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      return "String";
    }

    if (this.keywords.has(token.toLowerCase())) {
      return "Keyword";
    }

    return "Identifier";
  }
}
