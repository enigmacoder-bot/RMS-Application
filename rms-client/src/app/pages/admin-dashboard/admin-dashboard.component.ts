import { Component, ViewChild } from '@angular/core';
import { UserServices } from 'src/app/services/user-services';
import { PostServices } from 'src/app/services/posts.services';
import { CategoryServices } from 'src/app/services/category.services';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { SharedServices } from 'src/app/services/shared-services';
import { FeedbackServices } from 'src/app/services/feedback.services';
import { faUser,faEnvelopeOpen,faLayerGroup,faFlag } from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

users:any[] =[]
posts:any[] =[]
categories:any=[]
reports:any=[]
unRead:number=0
categoryId:string=""

report:any={}


faUser = faUser
faPost = faEnvelopeOpen
faCategories = faLayerGroup
faReport = faFlag


@ViewChild('editUser') editUser:any;
@ViewChild('addEditCategory') categoryModal:any
@ViewChild('feedback') feedbackModal:any

userForm = new FormGroup({
  userid:new FormControl(""),
  username:new FormControl(""),
  email:new FormControl(""),
  isPassword:new FormControl(false),
  password:new FormControl(""),
  confirmpassword:new FormControl(""),
  profileIcon:new FormControl(""),
})



categoryForm = new FormGroup({
  categoryName:new FormControl(""),
  tag:new FormControl(""),
  iconLink:new FormControl(""),
  description:new FormControl(""),
  colorcode:new FormControl(""),
  tags: new FormArray([]),
})



constructor(private userService:UserServices,private postService:PostServices,
private categorySerices:CategoryServices,private modalServices:NgbModal,
private sharedServices:SharedServices,private feedbackServices:FeedbackServices,
private router:Router){}

ngOnInit()
{
  this.getAllCategories();
  this.fetchAllReports();
}

searchUser(data:any)
{
  if(data.isValid)
  {
    this.userService.searchUserByName({searchKey:data.searchKey}).subscribe((data)=>{
      this.users = data
    })
  }
}

selectUserForEdit(user:any)
{ 
  this.userForm.patchValue({
    userid:user.userid,
    username:user.username,
    email:user.email,
    profileIcon:user.profileIcon
  });
  this.modalServices.open(this.editUser)
}

updateUser()
{
  console.log(this.userForm.value);
}


searchProducts()
{
  
}

getAllCategories()
{
  this.categorySerices.getAllCategory().subscribe((data)=>{
    this.categories = data
  })
}

 
displayTags()
{
  return this.categoryForm.get('tags') as FormArray;
}

addTagList()
{
  const tags = this.categoryForm.get('tags') as FormArray;
  const tag = new FormControl(this.categoryForm.value.tag)
  tags.push(tag)
  this.categoryForm.controls.tag.reset();
}
removeTag(index:number)
{
  (this.categoryForm.get('tags') as FormArray).removeAt(index)
}


openCategory()
{
  this.modalServices.open(this.categoryModal,{centered:true,backdrop:'static'})
}
closeCategory()
{
  this.modalServices.dismissAll()
}

createOrUpdateCategory() {
  if(this.categoryId)
  {
    let formObj ={
      label:this.categoryForm.value.categoryName,
      icon:this.categoryForm.value.iconLink,
      sublabel:this.categoryForm.value.tags?.join(';'),
      description:this.categoryForm.value.description,
      colorcode:this.categoryForm.value.colorcode,
    }
    this.categorySerices.updateCategory(this.categoryId,formObj).subscribe((data)=>{
      this.getAllCategories()
      this.categoryForm.reset()
      this.closeCategory()
    })
  }
  else{ 
    let formObj ={
      cid:Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000,
      label:this.categoryForm.value.categoryName,
      icon:this.categoryForm.value.iconLink,
      sublabel:this.categoryForm.value.tags?.join(';'),
      description:this.categoryForm.value.description,
      colorcode:this.categoryForm.value.colorcode,
      createdOn:moment().format('L')
    }
    this.categorySerices.createCategory(formObj).subscribe((data)=>{
      this.getAllCategories();
      this.categoryForm.reset()
      this.closeCategory()
    })
  }
}

selectCategoryForUpdate(data:any)
{

  this.openCategory()

  this.categoryId = data.cid
  this.categoryForm.patchValue({
    categoryName:data.label,
    iconLink:data.icon,
    description:data.description,
    colorcode:data.colorcode
  });
  const tagsArray = this.sharedServices.convertStringToArray(data.sublabel);
  const tags = this.displayTags()
  tagsArray.forEach((tag)=>{
    tags.push(new FormControl(tag))
  })
}
//  Support Code starts from here :

fetchAllReports()
{
  this.feedbackServices.getFeedbacks().subscribe((data)=>{
    this.reports = data;
  });
  this.reports.map((val:any)=>{
    if(!val.readed)
    {
      this.unRead = this.unRead + 1;
    }
  })
}

selectReport(report:any)
{
  this.report = report;
  this.feedbackServices.updateReaded(report.feedbackid).subscribe((data)=>{
    this.fetchAllReports();
  })
  this.modalServices.open(this.feedbackModal,{centered:true})
}

deleteTicket(event:Event) 
{
  event.stopPropagation()
  console.log("Hello")
}

visitPost(index:string)
{
  console.log(index)
  this.router.navigate(['product-detail',index])
  this.modalServices.dismissAll()
}
}
