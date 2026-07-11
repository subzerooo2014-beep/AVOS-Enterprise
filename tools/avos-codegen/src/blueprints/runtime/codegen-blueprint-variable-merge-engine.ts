import {
  CodeGenJsonValue,
} from "../../core/codegen.contracts";

export class CodeGenBlueprintVariableMergeEngine {
  merge(
    ...sources:
      Array<
        Record<
          string,
          CodeGenJsonValue
        >
      >
  ):
    Record<
      string,
      CodeGenJsonValue
    > {
    const result:
      Record<
        string,
        CodeGenJsonValue
      > = {};

    for (const source of sources) {
      for (
        const [key, value] of
        Object.entries(source)
      ) {
        result[key] =
          this.cloneValue(value);
      }
    }

    return result;
  }

  private cloneValue(
    value: CodeGenJsonValue,
  ): CodeGenJsonValue {
    return structuredClone(value);
  }
}
