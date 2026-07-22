import { Injectable } from '@nestjs/common';
@Injectable()
export class MediaAdapter {
 readonly capability='media';
 health(){return {capability:this.capability,connected:true,mode:'adapter',checkedAt:new Date().toISOString()};}
 execute(operation:string,payload:unknown){return {capability:this.capability,operation,accepted:true,payload,executedAt:new Date().toISOString()};}
}
