import { Injectable } from "@nestjs/common";
@Injectable()
export class EnterpriseKnowledgeFabricService {
  health() {
    return {
      success: true,
      system: "AVOS Enterprise Knowledge Fabric",
      status: "healthy",
    };
  }
}
