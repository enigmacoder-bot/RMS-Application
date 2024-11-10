import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

// Define the product interface
export interface Product {
  userid: string;
  category: string;
  productName: string;
  description: string;
  subcategory: string[];
  tags: string[];
  images: string[];
  date: string;
}

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private products: Product[] = [];

  constructor() {}

 
  searchProducts(
    searchTerm: string,
    subcategory?: string,
    tags?: string[]
  ): Observable<Product[]> {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return of(this.products).pipe(
      map((products) =>
        products.filter((product) => {
          const matchesSearchTerm =
            product.productName.toLowerCase().includes(lowerSearchTerm) ||
            product.description.toLowerCase().includes(lowerSearchTerm);

          // Check if the product matches the subcategory (if provided)
          const matchesSubcategory = subcategory
            ? product.subcategory.includes(subcategory)
            : true;

          // Check if the product matches the tags (if provided)
          const matchesTags = tags
            ? tags.every((tag) => product.tags.includes(tag))
            : true;

          // Return true if all conditions match
          return matchesSearchTerm && matchesSubcategory && matchesTags;
        })
      )
    );
  }
}
