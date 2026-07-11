export const AVOS_OS_VERSION = "1.0.0";

export function avosOsHealth() {
  return {
    name: "@avos/os",
    status: "OK",
    version: AVOS_OS_VERSION,
  };
}

export * from "./foundation";
export * from "./core";
export * from "./kernel";
