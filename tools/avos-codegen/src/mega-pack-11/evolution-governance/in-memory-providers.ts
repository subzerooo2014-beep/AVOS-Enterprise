import {
  BlueprintRequirementProvider,
  BlueprintVersionProvider,
} from "./compatibility-engine";

export class InMemoryBlueprintVersionProvider
  implements BlueprintVersionProvider {
  constructor(
    private readonly versions:
      Record<string, string> = {},
  ) {}

  getVersion(
    blueprintKey: string,
  ): string | undefined {
    return this.versions[
      blueprintKey
    ];
  }

  setVersion(
    blueprintKey: string,
    version: string,
  ): void {
    this.versions[
      blueprintKey
    ] = version;
  }
}

export class InMemoryBlueprintRequirementProvider
  implements BlueprintRequirementProvider {
  constructor(
    private readonly requirements:
      Record<
        string,
        Record<string, string>
      > = {},
  ) {}

  getRequiredVersion(
    proposalKey: string,
    blueprintKey: string,
  ): string | undefined {
    return this.requirements[
      proposalKey
    ]?.[
      blueprintKey
    ];
  }

  setRequirement(
    proposalKey: string,
    blueprintKey: string,
    version: string,
  ): void {
    this.requirements[
      proposalKey
    ] ??= {};

    this.requirements[
      proposalKey
    ]![
      blueprintKey
    ] = version;
  }
}
