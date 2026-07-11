import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class PermissionsGuard implements CanActivate{

 canActivate(context:ExecutionContext){

   return true;

 }

}
