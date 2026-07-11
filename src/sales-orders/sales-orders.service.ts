import { Injectable, NotFoundException } from "@nestjs/common";
import { SalesOrdersRepository } from "./sales-orders.repository";
import { SalesOrdersMapper } from "./sales-orders.mapper";
import { SalesOrdersSerializer } from "./sales-orders.serializer";

@Injectable()
export class SalesOrdersService {

 constructor(
  private readonly repo:SalesOrdersRepository,
  private readonly mapper:SalesOrdersMapper,
  private readonly serializer:SalesOrdersSerializer,
 ) {}

 async findAll(){

  return this.serializer.serializeMany(
    await this.repo.findAll()
  );

 }

 async findOne(id:string){

  const item = await this.repo.findOne(id);

  if(!item){
    throw new NotFoundException("Sales order not found");
  }

  return this.serializer.serialize(item);

 }

 async create(dto:any){

  const item = await this.repo.create(
    this.mapper.toCreateData(dto)
  );

  return this.serializer.serialize(item);

 }

}
