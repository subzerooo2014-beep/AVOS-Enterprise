import {
  CodeGenEnterpriseEndToEndRequest,
} from "../e2e/codegen-enterprise-e2e.contracts";
import {
  CodeGenEnterpriseEndToEndRuntime,
} from "../e2e/codegen-enterprise-end-to-end-runtime";

export class CodeGenEnterpriseRuntimeCliBridge {
  constructor(
    readonly runtime =
      new CodeGenEnterpriseEndToEndRuntime(),
  ) {}

  async execute(
    request:
      CodeGenEnterpriseEndToEndRequest,
  ): Promise<string> {
    const result =
      await this.runtime.execute(
        request,
      );

    return JSON.stringify(
      result,
      null,
      2,
    );
  }
}
