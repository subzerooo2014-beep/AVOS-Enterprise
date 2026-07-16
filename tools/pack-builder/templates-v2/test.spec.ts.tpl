import { {{SERVICE_NAME}} } from "./{{MODULE_SLUG}}.service";

export function verify{{SERVICE_NAME}}(): true {
  const service = new {{SERVICE_NAME}}();
  const status = service.status();

  if (status.success !== true) throw new Error("Expected success.");
  if (status.generatedBy !== "AVOS Pack Builder V2") throw new Error("Unexpected generator.");
  if (status.capabilities.length === 0) throw new Error("No capabilities.");

  return true;
}