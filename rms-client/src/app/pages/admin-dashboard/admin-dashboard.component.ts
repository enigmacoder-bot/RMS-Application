import { Component, ViewChild } from '@angular/core';
import { UserServices } from 'src/app/services/user-services';
import { PostServices } from 'src/app/services/posts.services';
import { CategoryServices } from 'src/app/services/category.services';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators,FormGroupName } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { SharedServices } from 'src/app/services/shared-services';
import { FeedbackServices } from 'src/app/services/feedback.services';
import { faUser,faEnvelopeOpen,faLayerGroup,faFlag,faTrash } from '@fortawesome/free-solid-svg-icons'
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
subInputTag:string=''
report:any={}


faUser = faUser
faPost = faEnvelopeOpen
faCategories = faLayerGroup
faReport = faFlag
faTrash = faTrash


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
  categoryName: new FormControl(""),
  tag: new FormControl(""),
  iconLink: new FormControl(""),
  description: new FormControl(""),
  colorcode: new FormControl(""),
  tags: new FormArray([]),
});


constructor(private userService:UserServices,private postService:PostServices,
private fb: FormBuilder,
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

displaySubTags(tagGroup:any)
{
  return tagGroup.get('subTags')?.value
} 

addTagList() {
  const tags = this.categoryForm.get('tags') as FormArray;
  const subTagArray = new FormArray([]);  // FormArray for sub-tags
  const tagGroup = new FormGroup({
    name: new FormControl(this.categoryForm.value.tag),
    subTags: subTagArray,
  });

  tags.push(tagGroup);
  this.categoryForm.controls.tag.reset();
  console.log(this.categoryForm)
}

addSubTag(index: number) {
  const tags = this.categoryForm.get('tags') as FormArray;
  const tagGroup = tags.at(index) as FormGroup;
  const subTags = tagGroup.get('subTags') as FormArray;

  const subTagName = this.subInputTag;
  if (subTagName) {
    subTags.push(new FormControl(subTagName));
    tagGroup.get('subTagInput')?.reset();
  }
  this.subInputTag=""
}
removeTag(index:number)
{
  (this.categoryForm.get('tags') as FormArray).removeAt(index)
}
removeSubTag(parentIndex:number,index:number)
{
  const list = this.categoryForm.get('tags') as FormArray
  const subList = (list.controls[parentIndex].get('subTags') as FormArray)
  subList.removeAt(index) 
}


openCategory()
{
  this.modalServices.open(this.categoryModal,{centered:true,backdrop:'static'})
}
closeCategory()
{
  this.modalServices.dismissAll()
  this.resetCategoryForm()
}

createOrUpdateCategory() {
  if(this.categoryId)
  {
    let formObj ={
      label:this.categoryForm.value.categoryName,
      icon:this.categoryForm.value.iconLink,
      sublabel:JSON.stringify(this.categoryForm.value.tags),
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
      sublabel:JSON.stringify(this.categoryForm.value.tags),
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
  const rawTags = JSON.parse(data.sublabel)
  const tags = this.displayTags()
  console.log(rawTags)
  rawTags?.forEach((tag: any)=> {
    const subTagArray = new FormArray(tag.subTags.map((subTag: string) => new FormControl(subTag)));
    const tagGroup = new FormGroup({
      name: new FormControl(tag.name),
      subTags: subTagArray
    });
    tags.push(tagGroup);
  });
}

resetCategoryForm()
{
  this.categoryForm.reset()
  this.categoryId=""
  const labels = this.categoryForm.get('tags') as FormArray;
  labels.clear()
}


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
