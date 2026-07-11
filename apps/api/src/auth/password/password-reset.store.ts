import { randomUUID } from "crypto";

export class PasswordResetStore {

  private static readonly tokens = new Map<string,string>();

  static create(email:string){

    const token=randomUUID();

    this.tokens.set(token,email);

    return token;

  }

  static consume(token:string){

    const email=this.tokens.get(token);

    if(email) this.tokens.delete(token);

    return email;

  }

}
