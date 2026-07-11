import {
  SystemGenerationArtifact,
  SystemGenerationRequest,
  SystemGenerationVerificationResult,
} from "./contracts";

export class SystemGenerationVerifier {
  verify(
    request:
      SystemGenerationRequest,
    artifacts:
      readonly SystemGenerationArtifact[],
  ): SystemGenerationVerificationResult {
    const paths =
      artifacts.map(
        (artifact) =>
          artifact.relativePath,
      );

    const duplicatePaths =
      paths.filter(
        (
          path,
          index,
          values,
        ) =>
          values.indexOf(path) !==
          index,
      );

    const emptyArtifacts =
      artifacts
        .filter(
          (artifact) =>
            !artifact.content.trim(),
        )
        .map(
          (artifact) =>
            artifact.key,
        );

    const generatedComponents =
      new Set(
        artifacts.map(
          (artifact) =>
            artifact.componentKey,
        ),
      );

    const missingComponents =
      request.components
        .filter(
          (component) =>
            !generatedComponents.has(
              component.key,
            ),
        )
        .map(
          (component) =>
            component.key,
        );

    return {
      success:
        duplicatePaths.length ===
          0 &&
        emptyArtifacts.length ===
          0 &&
        missingComponents.length ===
          0,
      artifactCount:
        artifacts.length,
      duplicatePaths: [
        ...new Set(
          duplicatePaths,
        ),
      ],
      emptyArtifacts,
      missingComponents,
      verifiedAt:
        new Date().toISOString(),
    };
  }
}
