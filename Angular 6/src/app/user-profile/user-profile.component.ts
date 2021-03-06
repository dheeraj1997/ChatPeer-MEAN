import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        // console.log(res.user._id);
        this.userService.setID(res['user']._id);
        // this.userDetails.interest = JSON.parse(this.userDetails.interest)
      },
      err => {
        console.log(err);

      }
    );
  }

  onLogout(){
    this.userService.deleteToken();
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}
