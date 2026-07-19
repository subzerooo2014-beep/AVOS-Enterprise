import { Injectable } from "@nestjs/common";

@Injectable()
export class PromptToBlueprintService{

  compile(prompt:string){
    const normalized = prompt.trim();

    return {
      prompt: normalized,
      name: normalized,
      domain: "General",
      modules: [
        "Core",
        "Users",
        "Administration"
      ],
      generatedAt: new Date().toISOString()
    };
  }
}
