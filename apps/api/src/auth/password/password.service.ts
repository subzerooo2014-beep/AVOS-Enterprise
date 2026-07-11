import * as bcrypt from "bcrypt";

export class PasswordService {

  static hash(password:string){
    return bcrypt.hash(password,12);
  }

  static verify(password:string,hash:string){
    return bcrypt.compare(password,hash);
  }

}
