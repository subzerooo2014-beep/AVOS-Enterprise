import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenGenerationCacheEntry, CodeGenGenerationCacheStats } from "./codegen-generation-cache-v2.contracts";
export declare class CodeGenGenerationCacheV2 {
    private readonly entries;
    private hits;
    private misses;
    fingerprint(artifact: CodeGenArtifactDescriptor): string;
    get(artifact: CodeGenArtifactDescriptor): CodeGenGenerationCacheEntry | undefined;
    put(artifact: CodeGenArtifactDescriptor): CodeGenGenerationCacheEntry;
    remove(key: string): CodeGenGenerationCacheEntry | undefined;
    stats(): CodeGenGenerationCacheStats;
    clear(): void;
}
//# sourceMappingURL=codegen-generation-cache-v2.d.ts.map