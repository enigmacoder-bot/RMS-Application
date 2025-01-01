import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { envirnomentConfig } from "../envirnoments/envirnoment";

@Injectable({
    providedIn:"root"
})

export class FeedbackServices{

    constructor(private http:HttpClient){}

    apiUrl = envirnomentConfig.baseUrl+"feedback"

    createFeedback(data:any):Observable<any>{
        return this.http.post<any>(`${this.apiUrl}`,data)
    }

    getFeedbacks():Observable<any[]>{
        return this.http.get<any>(`${this.apiUrl}`);
    }

    updateReaded(feedbackid:string):Observable<any>{
         return this.http.get<any>(`${this.apiUrl}/readed/${feedbackid}`)
    }

    deleteFeedback(feedbackid:string):Observable<any>{
        return this.http.delete<any>(`${this.apiUrl}/${feedbackid}`)
    }

}