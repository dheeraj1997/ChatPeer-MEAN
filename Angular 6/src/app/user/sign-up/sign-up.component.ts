import { Component, OnInit } from '@angular/core';
import { NgForm,FormArray,FormControl } from '@angular/forms';

import { UserService } from '../../shared/user.service'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  interests = [
    'Reading',
    'Traveling',
    'Fishing',
    'Crafts',
    'Television',
    'Collecting',
    'Music',
    'Bird Watching',
    'Gardening',
    'Video Games'
  ] ;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    // form.form.controls.interest.value = form.form.controls.interest.value.split(',');
    console.log("formvalue ",form.form.value);
    this.userService.postUser(form.value).subscribe(
      res => {
        this.showSucessMessage = true;
        setTimeout(() => this.showSucessMessage = false, 4000);
        this.resetForm(form);
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      }
    );
  }

  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      fullName: '',
      age:'',
      locality:'',
      interest:[''],
      email: '',
      password: '',
      status: false
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }

}
