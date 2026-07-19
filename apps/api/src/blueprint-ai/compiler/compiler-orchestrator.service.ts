import { Injectable } from "@nestjs/common";
import { CompilerPipelineService } from "../compiler/pipeline/compiler-pipeline.service";
import { SemanticAnalyzerService } from "../semantic/semantic-analyzer.service";
import { DomainModelEngineService } from "../domain/domain-model-engine.service";
import { BlueprintIrBuilderService } from "../ir/blueprint-ir-builder.service";

@Injectable()
export class CompilerOrchestratorService {

  constructor(
    private readonly pipeline:CompilerPipelineService,
    private readonly semantic:SemanticAnalyzerService,
    private readonly domain:DomainModelEngineService,
    private readonly ir:BlueprintIrBuilderService
  ){}

  compile(prompt:string){
    const syntax=this.pipeline.compile(prompt);
    const semantic=this.semantic.analyze(syntax.ast);
    const domain=this.domain.build(semantic);
    const blueprint=this.ir.build(domain);

    return {syntax,semantic,domain,blueprint};
  }

}
