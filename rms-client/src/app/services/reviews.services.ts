import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { envirnomentConfig } from "../envirnoments/envirnoment";

@Injectable({
    providedIn: "root"
})
export class ReviewService {
    apiUrl = envirnomentConfig.baseUrl+"reviews";

    constructor(private http: HttpClient) {}

    getReviewsByProductId(productId: string): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl+"/"+productId)
    }

    createReviews(data:any):Observable<any>{
        return this.http.post<any>(this.apiUrl,data)
    }

    updateReviews(data:any):Observable<any>{
        return this.http.put(`${this.apiUrl}`,data)
    }

    deleteReview(reviewid:string):Observable<any>{
        return this.http.delete(`${this.apiUrl}/${reviewid}`)
    }

}
