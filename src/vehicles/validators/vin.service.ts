export class VinService {

  static normalize(vin:string){
    return vin.trim().toUpperCase();
  }

  static isValid(vin:string){

    return /^[A-HJ-NPR-Z0-9]{17}$/.test(
      this.normalize(vin)
    );

  }

}
