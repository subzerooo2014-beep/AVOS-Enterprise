export class CodeGenWorkspaceSnapshotManager{
 create(name:string){
   return{
      id:crypto.randomUUID(),
      name,
      createdAt:new Date().toISOString()
   };
 }
}
