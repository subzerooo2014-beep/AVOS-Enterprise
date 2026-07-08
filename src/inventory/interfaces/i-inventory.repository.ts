export interface IinventoryRepository{

 paginate(page:number,limit:number):Promise<any>;

}
