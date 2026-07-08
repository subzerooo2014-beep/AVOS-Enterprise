export interface IcustomersRepository{

 paginate(page:number,limit:number):Promise<any>;

}
