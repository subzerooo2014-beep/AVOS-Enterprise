import { Injectable } from "@nestjs/common";

export interface TokenizerExecutionInput {
  input?: string;
  prompt?: string;
  text?: string;
}

export interface TokenizerExecutionResult {
  component: "tokenizer";
  input: string;
  tokens: string[];
  tokenCount: number;
  executedAt: string;
}

@Injectable()
export class TokenizerService {
  tokenize(input: string): string[] {
    if (typeof input !== "string") {
      throw new TypeError("Tokenizer input must be a string.");
    }

    return input
      .normalize("NFKC")
      .replace(/([.,;:!?()[\]{}])/g, " $1 ")
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(Boolean);
  }

  execute(body: TokenizerExecutionInput | string): TokenizerExecutionResult {
    const input = this.resolveInput(body);
    const tokens = this.tokenize(input);

    return {
      component: "tokenizer",
      input,
      tokens,
      tokenCount: tokens.length,
      executedAt: new Date().toISOString(),
    };
  }

  private resolveInput(body: TokenizerExecutionInput | string): string {
    if (typeof body === "string") {
      return body;
    }

    const input = body?.input ?? body?.prompt ?? body?.text;
    if (typeof input !== "string" || input.trim().length === 0) {
      throw new Error("Tokenizer requires a non-empty input, prompt, or text value.");
    }

    return input;
  }
}
