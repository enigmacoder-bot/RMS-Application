import { Component, ViewChild } from '@angular/core';
import { AuthServices } from 'src/app/services/auth.services';
import { PostServices } from 'src/app/services/posts.services';
import { FormGroup,FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { UserServices } from 'src/app/services/user-services';
import { faEye,faPenToSquare,faTrash,faUserPen,faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { SharedServices } from 'src/app/services/shared-services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent {

currentUser:any
posts:any[] =[]
readonly:boolean=true
postId:string =""
editUserIcon = faUserPen
viewPostIcon = faEye
editPostIcon = faPenToSquare
deleteIcon = faTrash
backIcon = faArrowLeft

userForm = new FormGroup({
  username : new FormControl(""),
  profileIcon :new FormControl("")
})

@ViewChild('editProfile') editModal:any
@ViewChild('deletePopup') deleteModal:any
selectedAvatarIndex: number =0;
username:string=''
avators  = ['red','yellow','green','blue','pink','white','pinkishred','black','silver']


constructor(private authServices:AuthServices,private postServices:PostServices,
  private router:Router,private modalService:NgbModal,private userService:UserServices,
  private sharedServices:SharedServices){}

ngOnInit(){
  this.currentUser = this.authServices.getloggedUser()
  this.getAllUserPosts()
  this.userForm.patchValue({
    username:this.currentUser.username,
    profileIcon:this.currentUser.profileIcon
  })
  this.username = this.currentUser.username
}

back()
{
 this.sharedServices.navigateToPreviousPage() 
}


getAllUserPosts()
{
  this.postServices.findPostByUserId(this.currentUser.userid).subscribe((data)=>{
    this.posts = data
  })
}


updateUserInfo()
{
  const profileIcon = this.avators.at(this.selectedAvatarIndex)
  const formObj = { username:this.username,profileIcon:profileIcon}

  this.userService.updateUserInfo(formObj).subscribe((data)=>{
    this.authServices.setloggedUser(data)
    setTimeout(()=>{
      location.reload()
    },500)
  })

}

allowEdit()
{
  this.readonly = false
  this.modalService.open(this.editModal,{centered:true,backdrop:'static'})
}
closeModal()
{
  this.modalService.dismissAll()
}


editPost(postid: string) {
  this.router.navigate(['create-product'], { queryParams: { postid: postid } });
}
onClickDelete(postid:string)
{
  this.modalService.open(this.deleteModal,{centered:true})
  this.postId = postid;
}

deletePost()
{ 
  this.postServices.deletePostById(this.postId).subscribe((data)=>{
    Swal.fire({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 3000, title: 'Success!', text: 'Successfully Deleted..!', icon: 'success', });
    this.getAllUserPosts()
  })
}



visitPost(index:string)
{
  this.router.navigate(['product-detail',index])
}


toggleOverlay(index: number) {
  if (this.selectedAvatarIndex === index) {
    this.selectedAvatarIndex = 0; 
  } else {
    this.selectedAvatarIndex = index; 
  }
}



}
