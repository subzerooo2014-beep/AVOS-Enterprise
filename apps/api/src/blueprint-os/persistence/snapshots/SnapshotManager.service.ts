import { Injectable } from "@nestjs/common";
@Injectable()
export class SnapshotManagerService{
 snapshot(){return{id:Date.now().toString(),createdAt:new Date().toISOString()};}
}
