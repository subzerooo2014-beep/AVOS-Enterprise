export interface IordersRepository{

 paginate(page:number,limit:number):Promise<any>;

}
