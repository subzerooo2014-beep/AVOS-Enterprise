import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaSchemaGeneratorService{

 generate(model:string){
   return `model ${model} {
  id String @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`;
 }

}
