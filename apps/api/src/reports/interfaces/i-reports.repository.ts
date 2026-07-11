export interface IreportsRepository{

 paginate(page:number,limit:number):Promise<any>;

}
