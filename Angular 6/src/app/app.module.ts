// built-in
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
// components
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
//routes
import { appRoutes } from './routes';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserService } from './shared/user.service';
import { ChatService} from "./shared/chat.service";
//other
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ShowProfileComponent } from './show-profile/show-profile.component';
import { ChatroomComponent } from './chatroom/chatroom.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SignUpComponent,
    UserProfileComponent,
    SignInComponent,
    ShowProfileComponent,
    ChatroomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes,{useHash:true}),
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },AuthGuard,UserService,ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
