import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthServices } from 'src/app/services/auth.services';
import { Router } from '@angular/router';
import { FeedbackServices } from 'src/app/services/feedback.services';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styles: [
  ]
})
export class SupportComponent {

  reportOptions = ['Bug','Nudity','Scam','Illegal','Suicide or self-injury','Violence','Hate Speech','Something else'];
  priorityOptions =['High','Mid','Low'];

  selectedOption:string=""
  priority:string=""
  reason:string=""
  postid =""
  userid=""
  comments=""

  constructor(private location:Location,
  private activeRouterServices:ActivatedRoute,
  private authServices:AuthServices,
  private feedbackServices:FeedbackServices,
  private routerServices:Router){
    this.activeRouterServices.queryParams.subscribe((param)=>{
      if(param['postid'])
      {
        this.postid = param['postid']
       this.userid =  this.authServices.getLoggeduserId()
      }
    })
  }

  ngOnInit()
  {

  }

  goBack()
  {
    this.location.back()
  }

  onPriorityChange(name:string)
  { 
    this.priority = name;
  }

  selectOption(name:string)
  {
    this.selectedOption = name
  }


  submitReport()
  {
    const formObj = {
      postid:this.postid,
      userid:this.userid,
      reason:this.selectedOption,
      comments:this.comments,
      priority:this.priority,      
    }
    this.feedbackServices.createFeedback(formObj).subscribe((data)=>{
      Swal.fire({
        title:'Report Submitted!',
        text: 'Thank you for your review..!',
        imageUrl:'https://cdn-icons-png.freepik.com/256/16387/16387448.png?ga=GA1.1.37151098.1700559503&semt=ais_hybrid'
      });
      setTimeout(()=>{
        this.location.back()
      },1000)
    })

  }


  


}
