import { Injectable } from "@nestjs/common";

@Injectable()
export class CertificationRegistryService{
 private readonly results:any[]=[];
 add(r:any){ this.results.push(r); }
 all(){ return this.results; }
}
