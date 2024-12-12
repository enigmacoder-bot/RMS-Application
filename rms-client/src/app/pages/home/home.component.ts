import { Component } from '@angular/core';
import { products } from 'src/data/product'
import {Router} from '@angular/router'
import { PostServices } from 'src/app/services/posts.services';
import { CategoryServices } from 'src/app/services/category.services';
import { SharedServices } from 'src/app/services/shared-services';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent {

  constructor(private router:Router,
  private postService:PostServices,
  private sharedServices:SharedServices,
  private categoryService:CategoryServices){}

  posts:any[]=[]
  categories:any[] =[]
  category:string | null =""
  searchKey:string | null =""

 
  ngOnInit()
  {
    this.getAllCategories()
    if(localStorage.getItem("searchKey")){
      this.category = localStorage.getItem("category")
      this.searchKey = localStorage.getItem("searchKey")
      this.postService.findPostByCategory({category:this.category,key:this.searchKey}).subscribe((data)=>{
        console.log(data)
        this.posts = data
      })
    localStorage.removeItem("searchKey")
    }
    
  }

  getAllCategories(){
    this.categoryService.getAllCategory().subscribe((data)=>{
      this.categories = data
    })
  }

  
  onSelectProduct(index:number)
  {
    if(this.searchKey)
    {
      localStorage.setItem("searchKey",this.searchKey)
    }
    this.router.navigate(['product-detail',index])
  }

  onCategorySelect(category:string)
  {
    localStorage.setItem("category",category)
    this.category = category
  }

  getProducts(key:any)
  {
    const category = localStorage.getItem("category")
    this.searchKey = key.searchKey
    if(key.isValid)
    {
      this.postService.findPostByCategory({category:category,key:key.searchKey}).subscribe((data)=>{
        this.posts = data
      })
    }
  }

  clearPosts()
  {
    this.posts =[]
    localStorage.removeItem("category")
    this.category =""
  }

  getBase64Image(buffer:any)
  {
    return "data:image/jpeg;base64," + this.sharedServices.convertBinaryToBase64(buffer)
  }

  trimString(description:string){
    return this.sharedServices.trimString(description,250,description.length)
  }

  async searchByLabel(label:string,sublabel:string)
  {
    this.onCategorySelect(label);
    await this.getProducts({searchKey:sublabel,isValid:true})
  }

  selectOrder(order:string)
  {
    this.posts.sort((a,b)=>{
      const date_a = new Date(a.date)
      const date_b = new Date(b.date)

      console.log(date_a)
      console.log(date_b)

      if(order ==='latest')
      {
        return date_b.getTime() - date_a.getTime()
      }
      else{
        return date_a.getTime() - date_b.getTime()
      }
    })
    console.log(this.posts)
  }


}
