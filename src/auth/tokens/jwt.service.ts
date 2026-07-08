import jwt from "jsonwebtoken";

export class JwtService{

 static sign(payload:any){

   return jwt.sign(
      payload,
      process.env.JWT_SECRET || "development-secret",
      {expiresIn:"1h"}
   );

 }

 static verify(token:string){

   return jwt.verify(
      token,
      process.env.JWT_SECRET || "development-secret"
   );

 }

}
