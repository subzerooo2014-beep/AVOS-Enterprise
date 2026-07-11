import { Injectable, NotFoundException } from "@nestjs/common";
import { PurchaseOrdersRepository } from "./purchase-orders.repository";
import { PurchaseOrdersMapper } from "./purchase-orders.mapper";
import { PurchaseOrdersSerializer } from "./purchase-orders.serializer";

@Injectable()
export class PurchaseOrdersService {

 constructor(
  private readonly repo:PurchaseOrdersRepository,
  private readonly mapper:PurchaseOrdersMapper,
  private readonly serializer:PurchaseOrdersSerializer,
 ){}

 async findAll(){

  return this.serializer.serializeMany(
   await this.repo.findAll()
  );

 }

 async findOne(id:string){

  const item = await this.repo.findOne(id);

  if(!item){
   throw new NotFoundException("Purchase order not found");
  }

  return this.serializer.serialize(item);

 }

 async create(dto:any){

  return this.serializer.serialize(
   await this.repo.create(
    this.mapper.toCreateData(dto)
   )
  );

 }

 async update(id:string,dto:any){

  await this.findOne(id);

  return this.serializer.serialize(
   await this.repo.update(
    id,
    this.mapper.toUpdateData(dto)
   )
  );

 }

}
