import {
  CodeGenBlueprintDefinition,
  CodeGenBlueprintTemplateBinding,
} from "../codegen-blueprint.contracts";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";

export interface CodeGenResolvedBlueprintBinding {
  blueprintKey: string;
  templateKey: string;
  order: number;
  enabled: boolean;
  variables:
    CodeGenBlueprintTemplateBinding["variables"];
}

export class CodeGenBlueprintBindingResolver {
  resolve(
    blueprint:
      CodeGenBlueprintDefinition,
  ): CodeGenResolvedBlueprintBinding[] {
    const enabled =
      blueprint.templateBindings
        .filter(
          (binding) =>
            binding.enabled,
        )
        .sort(
          (left, right) =>
            left.order -
            right.order,
        );

    const seenOrders =
      new Set<number>();

    for (const binding of enabled) {
      if (
        seenOrders.has(
          binding.order,
        )
      ) {
        throw new CodeGenValidationError(
          `Duplicate blueprint binding order ${binding.order} in ${blueprint.key}`,
        );
      }

      seenOrders.add(
        binding.order,
      );
    }

    return enabled.map(
      (binding) => ({
        blueprintKey:
          blueprint.key,
        templateKey:
          binding.templateKey,
        order:
          binding.order,
        enabled:
          binding.enabled,
        variables:
          structuredClone(
            binding.variables,
          ),
      }),
    );
  }
}
