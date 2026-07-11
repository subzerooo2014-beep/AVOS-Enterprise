import { Injectable, NotFoundException } from "@nestjs/common";
import { InventoryTransactionsRepository } from "./inventory-transactions.repository";
import { InventoryTransactionsMapper } from "./inventory-transactions.mapper";
import { InventoryTransactionsSerializer } from "./inventory-transactions.serializer";

@Injectable()
export class InventoryTransactionsService {

 constructor(
  private readonly repo:InventoryTransactionsRepository,
  private readonly mapper:InventoryTransactionsMapper,
  private readonly serializer:InventoryTransactionsSerializer,
 ){}

 async findAll(){

  return this.serializer.serializeMany(
   await this.repo.findAll()
  );

 }


 async findOne(id:string){

  const item = await this.repo.findOne(id);

  if(!item){
    throw new NotFoundException(
      "Inventory transaction not found"
    );
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

}
