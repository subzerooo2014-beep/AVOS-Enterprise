import { Injectable } from "@nestjs/common";
@Injectable()
export class ConnectorInstallerService {
  private readonly records:Array<Record<string,unknown>>=[];
  create(input:Record<string,unknown>) {
    const record={
      id:"connector-installer_"+Date.now(),
      ...input,
      createdAt:new Date().toISOString(),
    };
    this.records.push(record);
    return record;
  }
  list(){ return [...this.records]; }
}
