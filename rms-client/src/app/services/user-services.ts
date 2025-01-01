import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, switchMap } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthServices } from "./auth.services";
import { envirnomentConfig } from "../envirnoments/envirnoment";

@Injectable({
    providedIn:"root",
})

export class UserServices{

    constructor(private http:HttpClient,private authServices:AuthServices){}

    apiUrl = envirnomentConfig.baseUrl+"users"
   
    loginUser(data:any):Observable<any>{
      return this.http.post<any>(this.apiUrl+"/login",data)
    }

      registerUser(data:any):Observable<any>{
        data['isGoogleLogin'] = false
        data['isAdmin'] = false
        return this.http.post<any>(this.apiUrl+"/register",data);
      }

    updateUserInfo(data:any):Observable<any>{
      const token = this.authServices.getToken()
      let result = token?.replace(/"/g, '');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${result}`
      })

      return this.http.put(`${this.apiUrl}/profile`, data, { headers })
    }

    searchUserByName(key:any):Observable<any>{
      return this.http.post<any>(`${this.apiUrl}/search`,key)
    }

    
}