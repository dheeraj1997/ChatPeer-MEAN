import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { Headers } from '@angular/http';
// import { map } from 'rxjs/operators';

import 'rxjs/add/operator/map';
import {ImportMetadata} from "@angular/compiler-cli/src/metadata/evaluator";
import { environment } from '../../environments/environment';

@Injectable()
export class ChatService {

  constructor(private http: HttpClient) { }

  getChatByRoom(room) {
    return new Promise((resolve, reject) => {
      this.http.get(environment.apiBaseUrl+'/chat/' + room)
        .map(res => res)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  saveChat(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiBaseUrl+'/chat', data)
        .map(res => res)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

}
