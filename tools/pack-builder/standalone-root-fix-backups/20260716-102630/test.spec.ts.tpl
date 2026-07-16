import { {{SERVICE_NAME}} } from "./{{MODULE_SLUG}}.service";

export function verify{{SERVICE_NAME}}(): true {
  const service = new {{SERVICE_NAME}}();
  const status = service.status();

  if (status.success !== true) {
    throw new Error("Expected service status success.");
  }

  if (status.generatedBy !== "AVOS Pack Builder V2") {
    throw new Error("Unexpected generator marker.");
  }

  if (status.capabilities.length === 0) {
    throw new Error("Expected generated capabilities.");
  }

  return true;
}