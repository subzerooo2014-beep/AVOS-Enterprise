export interface Vehicle { id:string; make:string; model:string; year:number; mileage:number; askingPrice:number; currency:string; status:'active'|'reserved'|'sold'; createdAt:string; }
export interface Customer { id:string; name:string; email?:string; phone?:string; createdAt:string; }
export interface Listing { id:string; vehicleId:string; title:string; price:number; currency:string; status:'published'|'sold'; createdAt:string; }
export interface Reservation { id:string; vehicleId:string; customerId:string; status:'confirmed'|'cancelled'; expiresAt:string; createdAt:string; }
export interface PurchaseRequest { id:string; vehicleId:string; customerId:string; offeredPrice:number; currency:string; status:'pending'|'approved'; requiresHumanApproval:boolean; createdAt:string; }
