import { Injectable } from "@nestjs/common";
import { TokenizerService } from "../tokenizer/tokenizer.service";
import { LexerService } from "../lexer/lexer.service";
import { ParserService } from "../parser/parser.service";

@Injectable()
export class CompilerPipelineService{

  constructor(
    private readonly tokenizer:TokenizerService,
    private readonly lexer:LexerService,
    private readonly parser:ParserService
  ){}

  compile(prompt:string){
    const tokens=this.tokenizer.tokenize(prompt);
    const lexed=this.lexer.lex(tokens);
    const ast=this.parser.parse(lexed);

    return {tokens,lexed,ast};
  }

}
