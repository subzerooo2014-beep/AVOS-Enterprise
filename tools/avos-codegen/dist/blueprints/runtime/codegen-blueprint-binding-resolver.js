"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintBindingResolver = void 0;
const codegen_errors_1 = require("../../core/codegen.errors");
class CodeGenBlueprintBindingResolver {
    resolve(blueprint) {
        const enabled = blueprint.templateBindings
            .filter((binding) => binding.enabled)
            .sort((left, right) => left.order -
            right.order);
        const seenOrders = new Set();
        for (const binding of enabled) {
            if (seenOrders.has(binding.order)) {
                throw new codegen_errors_1.CodeGenValidationError(`Duplicate blueprint binding order ${binding.order} in ${blueprint.key}`);
            }
            seenOrders.add(binding.order);
        }
        return enabled.map((binding) => ({
            blueprintKey: blueprint.key,
            templateKey: binding.templateKey,
            order: binding.order,
            enabled: binding.enabled,
            variables: structuredClone(binding.variables),
        }));
    }
}
exports.CodeGenBlueprintBindingResolver = CodeGenBlueprintBindingResolver;
//# sourceMappingURL=codegen-blueprint-binding-resolver.js.map