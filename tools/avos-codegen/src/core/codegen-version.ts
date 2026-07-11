import {
  CodeGenValidationError,
} from "./codegen.errors";
import {
  CodeGenVersion,
} from "./codegen.contracts";

export const AVOS_CODEGEN_VERSION:
  CodeGenVersion = {
  major: 1,
  minor: 0,
  patch: 0,
  prerelease: "alpha.1",
};

export function formatCodeGenVersion(
  version: CodeGenVersion,
): string {
  const base =
    `${version.major}.` +
    `${version.minor}.` +
    `${version.patch}`;

  return version.prerelease
    ? `${base}-${version.prerelease}`
    : base;
}

export function parseCodeGenVersion(
  value: string,
): CodeGenVersion {
  const match =
    /^(\d+)\.(\d+)\.(\d+)(?:-([A-Za-z0-9.-]+))?$/
      .exec(value.trim());

  if (!match) {
    throw new CodeGenValidationError(
      `Invalid semantic version: ${value}`,
    );
  }

  const major =
    Number(match[1]);

  const minor =
    Number(match[2]);

  const patch =
    Number(match[3]);

  const prerelease =
    match[4];

  return {
    major,
    minor,
    patch,
    ...(prerelease
      ? { prerelease }
      : {}),
  };
}
