import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenArtifactChange,
  CodeGenArtifactChangeType,
  CodeGenIncrementalSnapshot,
} from "../contracts/codegen-incremental.contracts";
import {
  CodeGenArtifactStateFactory,
} from "./codegen-artifact-state-factory";

export class CodeGenIncrementalChangeDetector {
  constructor(
    readonly states =
      new CodeGenArtifactStateFactory(),
  ) {}

  detect(
    artifacts:
      readonly CodeGenArtifactDescriptor[],
    snapshot?:
      CodeGenIncrementalSnapshot,
  ): CodeGenArtifactChange[] {
    const currentStates =
      this.states.createMany(
        artifacts,
      );

    const previousByKey =
      new Map(
        (snapshot?.artifacts ?? [])
          .map(
            (state) => [
              state.artifactKey,
              state,
            ],
          ),
      );

    const currentByKey =
      new Map(
        currentStates.map(
          (state) => [
            state.artifactKey,
            state,
          ],
        ),
      );

    const changes:
      CodeGenArtifactChange[] = [];

    for (
      const current of
      currentStates
    ) {
      const previous =
        previousByKey.get(
          current.artifactKey,
        );

      if (!previous) {
        changes.push({
          artifactKey:
            current.artifactKey,
          relativePath:
            current.relativePath,
          type:
            CodeGenArtifactChangeType.CREATED,
          current,
          reason:
            "Artifact does not exist in previous snapshot",
          detectedAt:
            new Date().toISOString(),
        });

        continue;
      }

      if (
        previous.relativePath !==
        current.relativePath
      ) {
        changes.push({
          artifactKey:
            current.artifactKey,
          relativePath:
            current.relativePath,
          type:
            CodeGenArtifactChangeType.MOVED,
          previous,
          current,
          reason:
            "Artifact target path changed",
          detectedAt:
            new Date().toISOString(),
        });

        continue;
      }

      if (
        previous.checksum !==
        current.checksum
      ) {
        changes.push({
          artifactKey:
            current.artifactKey,
          relativePath:
            current.relativePath,
          type:
            CodeGenArtifactChangeType.MODIFIED,
          previous,
          current,
          reason:
            "Artifact checksum changed",
          detectedAt:
            new Date().toISOString(),
        });

        continue;
      }

      changes.push({
        artifactKey:
          current.artifactKey,
        relativePath:
          current.relativePath,
        type:
          CodeGenArtifactChangeType.UNCHANGED,
        previous,
        current,
        reason:
          "Artifact checksum and path are unchanged",
        detectedAt:
          new Date().toISOString(),
      });
    }

    for (
      const previous of
      snapshot?.artifacts ?? []
    ) {
      if (
        currentByKey.has(
          previous.artifactKey,
        )
      ) {
        continue;
      }

      changes.push({
        artifactKey:
          previous.artifactKey,
        relativePath:
          previous.relativePath,
        type:
          CodeGenArtifactChangeType.DELETED,
        previous,
        reason:
          "Artifact no longer exists in current generation set",
        detectedAt:
          new Date().toISOString(),
      });
    }

    return changes.sort(
      (left, right) =>
        left.artifactKey.localeCompare(
          right.artifactKey,
        ),
    );
  }
}
