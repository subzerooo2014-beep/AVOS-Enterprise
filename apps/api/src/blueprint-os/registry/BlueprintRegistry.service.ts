import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintRegistryService{
  private readonly blueprints = [];
  all(){ return this.blueprints; }
}
