import { Component, ViewChild } from '@angular/core';
// import { products } from 'src/data/product'
import { PostServices } from 'src/app/services/posts.services';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from 'src/app/services/reviews.services';
import { AuthServices } from 'src/app/services/auth.services';
import { SharedServices } from 'src/app/services/shared-services';
import { faArrowLeft,faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-product-detals',
  templateUrl: './product-detals.component.html',
  styles: [
  ]
})




export class ProductDetalsComponent {

   expressions =[
    {
      sentence:"Exceptional!",
      code:5
    },
    {
      sentence:"Great experience",
      code:4
    },
    {
      sentence:"Good",
      code:3
    },
    {
      sentence:"Disappointing",
      code:2
    },
    {
      sentence:"Very Poor",
      code:1
    },
   ]
  id:any
  currentProduct:any
  reviews:any[] =[]
  Images:any[]=[]
  ratings:number=0
  comments:string=""
  isLoggedIn:boolean = false
  userid:string=""
  reviewid:string=""
  isAdmin:boolean=false;

  postid:string=''

  backArrow = faArrowLeft;
  settings = faEllipsisVertical
  
  @ViewChild("deletePopup") deleteModal:any;

  constructor(private router:ActivatedRoute,private postService:PostServices,private reviewService:ReviewService,
    private authServices:AuthServices,private sharedServices:SharedServices,private routerServices:Router,
    private modalServices:NgbModal){}

  ngOnInit()
  {
    this.id = this.router.snapshot.paramMap.get('id')
    this.getPostById()
    this.getReviews()
    this.isLoggedIn = this.authServices.isLoggedIn()
    this.userid = this.authServices.getLoggeduserId()
    this.isAdmin = this.authServices.IsUserAdmin()
  }

  back()
  {
    this.sharedServices.navigateToPreviousPage()
  }

  getReviews()
  {
    this.reviewService.getReviewsByProductId(this.id).subscribe((data)=>{
      this.reviews = data
      console.log(data)
    })
  }

  getPostById()
  {
    this.postService.getPostById(this.id).subscribe((data)=>{
      this.currentProduct = data
      this.currentProduct.images.map((image:any)=>{
        this.Images.push(this.getBase64Image(image.data))
      })
    })
    
  }

  clear()
  {
    this.ratings = 0
    this.comments =""
  }

  createRatings()
  {
    if(this.reviewid){
      const formObj = { reviewid:this.reviewid,comment:this.comments,ratings:this.ratings } 
      this.reviewService.updateReviews(formObj).subscribe((data)=>{
        Swal.fire({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 3000, title: 'Success!', text: 'Review Updated', icon: 'success', });
        this.getReviews()
        this.clear()
      })
    }
    else{
      if(this.comments === "")
        {
          return false
        }
        else{
          const reviewForm = {} as any
          console.log(this.ratings)
          reviewForm["reviewid"]=crypto.randomUUID()
          reviewForm["userid"] = this.userid
          reviewForm["postid"] = this.currentProduct.postid
          reviewForm["ratings"] = this.ratings
          reviewForm["comment"]= this.comments
          reviewForm["createdOn"] = moment().format('L');
      
          this.reviewService.createReviews(reviewForm).subscribe((data)=>{
            Swal.fire({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 3000, title: 'Success!', text: 'Review Submitted', icon: 'success', });
            this.getReviews()
          })
          this.updateRatings(this.ratings)
          this.clear()
        }
    } 
   return true
  }

  updateRatings(data:number)
  {
   let ratings = parseFloat(((this.currentProduct.ratings + data) / 2).toFixed(2));
   const ratingsForm ={
    ratings: ratings,
    postid:this.currentProduct.postid
   }
   this.postService.updateRatings(ratingsForm).subscribe((data)=>{
    this.getPostById()
   })
  }


  get getReviewSentence()
  {
    const exp = this.expressions.find((exp)=>{ return exp.code === this.ratings })
    return exp?.sentence
  }

  getBase64Image(buffer:any)
  {
    return "data:image/jpeg;base64," + this.sharedServices.convertBinaryToBase64(buffer)
  }

  populateReview(review:any)
  {
      this.reviewid = review.reviewid;
      this.comments = review.comment;
      this.ratings = review.ratings;
  }

  deleteReview(reviewid:string)
  { 
    this.reviewService.deleteReview(reviewid).subscribe((data)=>{
      Swal.fire({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 3000, title: 'Success!', text: 'Review Deleted', icon: 'success', });
      this.getReviews()
      this.clear()
    })
  }

  navigateToReport()
  {
    this.routerServices.navigate(['/report'],{queryParams:{postid:this.currentProduct.postid}})
  }

  checkIsAdmin()
  {
    return this.authServices.IsUserAdmin;
  }

  deletePost()
  {
    if(this.checkIsAdmin())
    {
      this.postService.deletePostById(this.currentProduct.postid).subscribe((data)=>{
       this.routerServices.navigateByUrl('/dashboard')
      })
    }
  }
  closeDeleteModal()
  {
    this.modalServices.dismissAll();
  }

  selectOrder(order:string)
  {
      this.reviews.sort((a,b)=>{
        const date_a = new Date(a.createdOn);
        const date_b = new Date(b.createdOn);

        if(order === 'latest')
        {
          return date_b.getTime() - date_a.getTime()
        }
        else{
          return date_a.getTime()-date_b.getTime()
        }

      })
  }

  openDeleteModal()
  {
    this.modalServices.open(this.deleteModal,{centered:true});
  }


}
