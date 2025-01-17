import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserServices } from 'src/app/services/user-services';
import { AuthServices } from 'src/app/services/auth.services';
import { SharedServices } from 'src/app/services/shared-services';
import { Router } from '@angular/router';
import { envirnomentConfig } from 'src/app/envirnoments/envirnoment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements AfterViewInit {
  constructor(
    private authService: AuthServices,
    private userService: UserServices,
    private router: Router,
    private sharedSerice: SharedServices
  ) {}

  @ViewChild('loginform') loginform: NgForm | undefined;

  email: string = '';
  password: string = '';
  authenticateString: string = 'Dont have an account? Create one !';
  isSignIn: boolean = true;
  errorMessage =""

  ngAfterViewInit() {}

  loginUser() {
    if (this.email && this.password && !this.validatePassword()) {
      const loginObj = this.loginform?.value;
      this.errorMessage=''
      this.userService.loginUser(loginObj).subscribe({
        next : (data) => {
          this.authService.setloggedUser(data);
            this.router.navigateByUrl('/');
            setTimeout(() => {
              location.reload();
            }, 1000);
        },
        error : (err) =>{
          this.errorMessage = err.error.error
        }
      })
    }
  }

  registerUser() {
    if (this.email && this.password && !this.validatePassword()) {
      const formObj = this.loginform?.value;
      formObj['username'] = this.sharedSerice.randomizeUsername(formObj.email);
      this.userService.registerUser(formObj).subscribe({
        next : (data) =>{
          this.authService.setloggedUser(data);
          this.router.navigateByUrl('/');
          setTimeout(() => {
              location.reload();
          }, 1000);
        },
        error :(err) =>{
          this.errorMessage = err.error.error
        }
      })
    }
  }

  toggleMethods() {
    this.isSignIn = !this.isSignIn;
    this.authenticateString = this.isSignIn
      ? 'Dont have an account? Create one !'
      : 'Have an account? Login !';
    this.loginform?.reset();
  }

  validateEmail() {

  }

  validatePassword(): boolean {
    if (this.password) {
      return this.password.length < 6;
    }
    return false;
  }

  openWindow() {
    window.location.href=envirnomentConfig.baseUrl+"users/auth/google";
  }
}
