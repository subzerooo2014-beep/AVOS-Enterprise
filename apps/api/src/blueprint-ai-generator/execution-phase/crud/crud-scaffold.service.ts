import { Injectable } from "@nestjs/common";

@Injectable()
export class CrudScaffoldService{

 generate(resource:string){
   const base = resource.toLowerCase();

   return {
     resource,
     endpoints:[
       `GET /${base}`,
       `GET /${base}/:id`,
       `POST /${base}`,
       `PATCH /${base}/:id`,
       `DELETE /${base}/:id`
     ],
     files:[
       `${base}.controller.ts`,
       `${base}.service.ts`,
       `${base}.entity.ts`,
       `create-${base}.dto.ts`,
       `update-${base}.dto.ts`
     ]
   };
 }
}
