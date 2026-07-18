import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosBlueprint,
  BlueprintExecutionPlan,
  BlueprintPlanStep,
  BlueprintStep
} from "./blueprint.contracts";
import {
  BlueprintDependencyCycleError
} from "./blueprint.errors";

@Injectable()
export class BlueprintPlannerService {
  createPlan(
    blueprint: AvosBlueprint,
    approved = false
  ): BlueprintExecutionPlan {
    const enabledSteps =
      blueprint.steps.filter(
        (step) => step.enabled !== false
      );

    const sortedSteps =
      this.topologicalSort(
        enabledSteps
      );

    const planSteps:
      BlueprintPlanStep[] =
      sortedSteps.map(
        (step, index) => ({
          order: index + 1,
          stepId: step.id,
          name: step.name,
          type: step.type,
          pluginId: step.pluginId,
          target: step.target,
          templateId: step.templateId,
          outputPath:
            step.outputPath,
          input:
            structuredClone(
              step.input ?? {}
            ),
          dependsOn: [
            ...(step.dependsOn ?? [])
          ],
          requiresApproval:
            step.requiresApproval === true,
          executable:
            step.enabled !== false
        })
      );

    const requiresHumanApproval =
      blueprint.metadata
        .humanFinalAuthority === true ||
      planSteps.some(
        (step) =>
          step.requiresApproval
      );

    return {
      id: randomUUID(),
      blueprintId: blueprint.id,
      blueprintVersion:
        blueprint.version,
      createdAt:
        new Date().toISOString(),
      requiresHumanApproval,
      approved:
        requiresHumanApproval
          ? approved
          : true,
      steps: planSteps,
      warnings:
        requiresHumanApproval &&
        !approved
          ? [
              "Execution plan requires human approval."
            ]
          : []
    };
  }

  private topologicalSort(
    steps: BlueprintStep[]
  ): BlueprintStep[] {
    const stepsById =
      new Map<string, BlueprintStep>();

    const inDegree =
      new Map<string, number>();

    const dependants =
      new Map<string, string[]>();

    for (const step of steps) {
      stepsById.set(step.id, step);
      inDegree.set(step.id, 0);
      dependants.set(step.id, []);
    }

    for (const step of steps) {
      for (
        const dependency
        of step.dependsOn ?? []
      ) {
        if (!stepsById.has(dependency)) {
          continue;
        }

        inDegree.set(
          step.id,
          (inDegree.get(step.id) ?? 0) + 1
        );

        dependants.get(dependency)?.push(
          step.id
        );
      }
    }

    const queue =
      [...steps]
        .filter(
          (step) =>
            (inDegree.get(step.id) ?? 0) === 0
        )
        .sort(
          (left, right) =>
            left.id.localeCompare(right.id)
        );

    const result: BlueprintStep[] = [];

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current) {
        break;
      }

      result.push(current);

      for (
        const dependantId
        of dependants.get(current.id) ?? []
      ) {
        const nextDegree =
          (inDegree.get(dependantId) ?? 0) -
          1;

        inDegree.set(
          dependantId,
          nextDegree
        );

        if (nextDegree === 0) {
          const dependant =
            stepsById.get(dependantId);

          if (dependant) {
            queue.push(dependant);

            queue.sort(
              (left, right) =>
                left.id.localeCompare(
                  right.id
                )
            );
          }
        }
      }
    }

    if (
      result.length !== steps.length
    ) {
      const cycle =
        steps
          .filter(
            (step) =>
              (inDegree.get(step.id) ?? 0) > 0
          )
          .map((step) => step.id);

      throw new BlueprintDependencyCycleError(
        cycle
      );
    }

    return result;
  }
}
