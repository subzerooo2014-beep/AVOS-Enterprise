import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class PublisherEnterpriseBootstrapService implements OnModuleInit {
  onModuleInit() {
    console.log("[PublisherEnterprise] Ready.");
  }
}
