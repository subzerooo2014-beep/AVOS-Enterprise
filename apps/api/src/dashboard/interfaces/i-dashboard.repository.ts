export interface IdashboardRepository{

 paginate(page:number,limit:number):Promise<any>;

}
