import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineRegistryService{

  private readonly registry:any[]=[];

  register(item:any){
    this.registry.push(item);
  }

  all(){
    return this.registry;
  }

}
