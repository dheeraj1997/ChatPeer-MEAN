import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import {ChatService} from "../shared/chat.service";
import { Router } from "@angular/router";
import * as io from "socket.io-client";

@Component({
  selector: 'app-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrls: ['./show-profile.component.css']
})
export class ShowProfileComponent implements OnInit {

  count = 0;
  userDetails;
  loggedUser;
  suggested;
  chats: any;
  joinned: boolean = false;
  newUser = { nickname: '', room: '' };
  msgData = { room: '', nickname: '', message: '' };
  socket = io('http://localhost:3000');


  constructor(private userService: UserService, private router: Router, private chatService: ChatService) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        // localStorage.setItem('_id', res['user']._id);
        this.userService.setID(res['user']._id);
        this.loggedUser = res['user'];
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
      },
      err => {
        console.log(err);
      }
    );
    console.log("constructor was called.");
  }

  onLogout(){
    console.log('onLogout clicked');
    this.userService.logout().subscribe(res => {
      console.log('success ',res);
    }, err => {
      console.log('error logging out ',err);
    });
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }
  ifProfile(){
    this.router.navigate(['/userprofile']);
  }
  // ifAccept(){
  //   this.router.navigate(['/chatroom']);
  // }

  ifReject(){
    if(this.count<this.suggested.length) {
      this.count = this.count + 1;
      this.userDetails = this.suggested[this.count];
    }
    else this.userDetails = null;
  }

  getChatByRoom(room) {
    this.chatService.getChatByRoom(room).then((res) => {
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }


  joinRoom() {
    var date = new Date();
    const id = localStorage.getItem('_id');
    let room = (id < this.userDetails._id) ? (this.userDetails._id + id ) : (id + this.userDetails._id);
    this.newUser.nickname = this.loggedUser.fullName.split(' ')[0];
    this.newUser.room = room;
    localStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    this.socket.emit('save-message', { room: this.newUser.room, nickname: this.newUser.nickname, message: 'Joined', updated_at: date });
    this.router.navigate(['/chatroom']);
  }

  joinCommonRoom() {
    var date = new Date();
    const id = localStorage.getItem('_id');
    // let room = (id < this.userDetails._id) ? (this.userDetails._id + id ) : (id + this.userDetails._id);
    this.newUser.nickname = this.loggedUser.fullName.split(' ')[0];
    this.newUser.room = 'common-room';
    localStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    this.socket.emit('save-message', { room: this.newUser.room, nickname: this.newUser.nickname, message: 'Joined', updated_at: date });
    this.router.navigate(['/chatroom']);
  }


}
