import { Injectable } from "@nestjs/common";
import { FACTORY_SYSTEM_ID, FACTORY_VERSION } from "../constants/factory.constants";

@Injectable()
export class FactoryVersionService {
  describe() {
    return {
      system: FACTORY_SYSTEM_ID,
      version: FACTORY_VERSION,
      apiVersion: "v1",
      architecture: "factory-kernel-runtime",
    };
  }
}
