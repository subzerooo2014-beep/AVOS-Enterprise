export interface IemployeesRepository{

 paginate(page:number,limit:number):Promise<any>;

}
