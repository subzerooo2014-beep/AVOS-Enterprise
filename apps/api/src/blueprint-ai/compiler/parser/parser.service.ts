import { Injectable } from "@nestjs/common";
import { BlueprintLexeme } from "../lexer/lexer.service";

export interface BlueprintAstNode {
  kind: string;
  value?: string;
  index?: number;
  children?: BlueprintAstNode[];
}

export interface BlueprintAst {
  type: "BlueprintRoot";
  nodes: BlueprintAstNode[];
  metadata: {
    nodeCount: number;
    identifiers: string[];
    keywords: string[];
  };
}

export interface ParserExecutionInput {
  stream?: BlueprintLexeme[];
  lexemes?: BlueprintLexeme[];
}

export interface ParserExecutionResult {
  component: "parser";
  ast: BlueprintAst;
  executedAt: string;
}

@Injectable()
export class ParserService {
  parse(stream: BlueprintLexeme[]): BlueprintAst {
    if (!Array.isArray(stream)) {
      throw new TypeError("Parser stream must be an array.");
    }

    const nodes = stream.map<BlueprintAstNode>((lexeme) => ({
      kind: lexeme.type,
      value: lexeme.value,
      index: lexeme.index,
    }));

    return {
      type: "BlueprintRoot",
      nodes,
      metadata: {
        nodeCount: nodes.length,
        identifiers: stream
          .filter((lexeme) => lexeme.type === "Identifier")
          .map((lexeme) => lexeme.value),
        keywords: stream
          .filter((lexeme) => lexeme.type === "Keyword")
          .map((lexeme) => lexeme.value),
      },
    };
  }

  execute(body: ParserExecutionInput | BlueprintLexeme[]): ParserExecutionResult {
    const stream = this.resolveStream(body);
    const ast = this.parse(stream);

    return {
      component: "parser",
      ast,
      executedAt: new Date().toISOString(),
    };
  }

  private resolveStream(
    body: ParserExecutionInput | BlueprintLexeme[],
  ): BlueprintLexeme[] {
    if (Array.isArray(body)) {
      return body;
    }

    const stream = body?.stream ?? body?.lexemes;
    if (!Array.isArray(stream)) {
      throw new Error("Parser requires a stream or lexemes array.");
    }

    return stream;
  }
}
