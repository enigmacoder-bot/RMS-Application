import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { ProductDetalsComponent } from './pages/product-detals/product-detals.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { SupportComponent } from './pages/support/support.component';

const routes:Routes=[
  {
    path:'', component:HomeComponent
  },
  {
    path:'profile', component:ProfileComponent
  },
  {
    path:'create-product', component:CreateProductComponent
  },
  {
    path:'product-detail/:id', component:ProductDetalsComponent
  },
  {
    path:'login', component:LoginComponent
  },
  {
    path:'dashboard',component:AdminDashboardComponent
  },
  {
    path:'auth/google/callback',component:CallbackComponent
  },
  {
    path:'report',component:SupportComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
