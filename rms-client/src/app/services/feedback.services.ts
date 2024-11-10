import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:"root"
})

export class FeedbackServices{

    constructor(private http:HttpClient){}

    apiUrl = "http://localhost:9883/api/feedback"

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