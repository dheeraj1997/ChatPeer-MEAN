import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrls: ['./show-profile.component.css']
})
export class ShowProfileComponent implements OnInit {

  userDetails;
  suggested;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getOthersProfile().subscribe(
      res => {
        console.log("showing recieved profile ",res);
        this.userDetails = res[0];
        this.suggested = res;
      },
      err => {
        console.log(err);
      }
    );

    console.log("constructor was called.");
  }

  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }
  ifProfile(){
    this.router.navigate(['/userprofile']);
  }
  ifAccept(){
    this.router.navigate(['/chatroom']);
  }

  ifReject(){
    this.userDetails = this.suggested[1];
  }
}
