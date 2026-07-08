import { Injectable } from "@nestjs/common";

@Injectable()
export class ListingsEngineService{
  publish(vehicle:any){
    return {
      listingId: crypto.randomUUID(),
      status: "PUBLISHED",
      vehicle,
      publishedAt: new Date().toISOString(),
    };
  }

  unpublish(id:string){
    return {
      listingId:id,
      status:"UNPUBLISHED",
    };
  }
}
