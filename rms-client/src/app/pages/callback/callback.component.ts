import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServices } from 'src/app/services/auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent {

token:string=""

constructor(private activeRouter:ActivatedRoute,private authService:AuthServices,private router:Router){
}

ngOnInit()
{
  this.activeRouter.queryParams.subscribe((params)=>{
    if(params['token'])
    {
      this.token =params['token']
    }
  })
  this.authService.setloggedUser(this.token)
  this.router.navigateByUrl('/')
  setTimeout(()=>{
    location.reload()
  },1000)
}


}
