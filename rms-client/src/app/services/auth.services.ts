import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Router } from '@angular/router';

@Injectable({
    providedIn:"root"
})

export class AuthServices{
    private authDetails = new BehaviorSubject<any>({})
    AuthObDetails = this.authDetails.asObservable()
  
    private auth = new BehaviorSubject<boolean>(false);
    authObj = this.auth.asObservable()
  
    private role = new BehaviorSubject<string>("");
    roleObj = this.role.asObservable();


    constructor(private router:Router) {
      const Isuser = sessionStorage.getItem("user");
      if(Isuser)
      {  
        const userData = this.decodeJWT(Isuser);     
        this.authDetails.next(userData)
      }
     }



      decodeJWT(token: string): any {
        const payloadPart = token.split('.')[1];
        return JSON.parse(atob(payloadPart));
      }

      setloggedUser(data:any){
        if(sessionStorage.getItem("user")){
          sessionStorage.removeItem("user")
          sessionStorage.setItem("user",JSON.stringify(data))
        }
        if(JSON.stringify(data['token']))
        {
          sessionStorage.setItem("user",JSON.stringify(data['token']))
          data = this.decodeJWT(JSON.stringify(data))
          this.authDetails.next(data)
        }
        else{
          sessionStorage.setItem("user",data)
          data = this.decodeJWT(JSON.stringify(data))
          this.authDetails.next(data)
        }

      }

      login(data:boolean){
        this.auth.next(data)
      }
      
      logout(data:boolean){
        this.auth.next(data)
        sessionStorage.removeItem("user")
        this.router.navigateByUrl("/login")
        setTimeout(()=>{
          location.reload()
        },1000)
      }

      getloggedUser(){
        return this.authDetails.value
      }

      getLoggeduserId()
      {
        return this.authDetails.value.userid
      }

      getUserRole(){
        return this.authDetails.value.isAdmin
      }


      isLoggedIn()
      {
        return this.authDetails.value.userid
      }

      IsUserAdmin()
      {
        return this.authDetails.value.isAdmin === 1;
      }

      getToken()
      {
        return sessionStorage.getItem("user");
      }
    
}