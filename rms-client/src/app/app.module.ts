import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetalsComponent } from './pages/product-detals/product-detals.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import {MatIconModule} from '@angular/material/icon'
import {MatTabsModule} from '@angular/material/tabs';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CallbackComponent } from './pages/callback/callback.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { SupportComponent } from './pages/support/support.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatExpansionModule} from '@angular/material/expansion';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductDetalsComponent,
    CreateProductComponent,
    ProfileComponent,
    LoginComponent,
    LoaderComponent,
    CarouselComponent,
    AdminDashboardComponent,
    CallbackComponent,
    SearchbarComponent,
    SupportComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatTabsModule,
    NgbModalModule,
    NgbDropdownModule,
    FontAwesomeModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
