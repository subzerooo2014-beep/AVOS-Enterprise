import { GovernanceSnapshotScope, GovernanceSnapshotSection } from "../contracts";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
export declare class RuntimeGovernanceSnapshotBuilderService {
    private readonly store;
    constructor(store: RuntimeGovernanceStore);
    build(scope: GovernanceSnapshotScope): GovernanceSnapshotSection[];
    rootChecksum(sections: GovernanceSnapshotSection[]): string;
}
