import {
  CodeGenValidationRuntime,
} from "../runtime/codegen-validation-runtime";
import {
  CodeGenValidationContext,
} from "../contracts/codegen-validation.contracts";

export class CodeGenValidationCliService {
  constructor(
    readonly runtime =
      new CodeGenValidationRuntime(),
  ) {}

  async validate(
    context:
      CodeGenValidationContext,
  ): Promise<string> {
    const result =
      await this.runtime.execute(
        context,
      );

    return JSON.stringify(
      result,
      null,
      2,
    );
  }
}
