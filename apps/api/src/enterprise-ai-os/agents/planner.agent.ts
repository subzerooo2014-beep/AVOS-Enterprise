import { Injectable } from "@nestjs/common";
@Injectable()
export class PlannerAgent {
  execute(input: { objective: string; constraints?: string[] }) {
    return {
      objective: input.objective,
      steps: [
        { order: 1, action: "analyze_context" },
        { order: 2, action: "identify_options" },
        { order: 3, action: "evaluate_risks" },
        { order: 4, action: "select_plan" },
      ],
      constraints: input.constraints ?? [],
    };
  }
}
