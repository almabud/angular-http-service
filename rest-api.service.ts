import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {SessionService} from './session.service';

export class HttpArgs {
  apiEndPoint: string;
  data: object = {};
  auth = true;
  httpHeaders: any = {'Content-Type': 'application/json'};
  constructor(args: any) {
    if (!args.hasOwnProperty('apiEndPoint')){
      throw new Error('Missing API EndPoint!!');
    }

    if (args.hasOwnProperty('httpHeader')) {
      var defaultHttpHeaders = this.httpHeaders;
    }
    Object.assign(this, args);
    this.httpHeaders = new HttpHeaders({...defaultHttpHeaders, ...args.httpHeaders});
  }

}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private sessionService: SessionService) { }

  makeAuthHttpHeader(httpHeaders: HttpHeaders): HttpHeaders{
      httpHeaders = httpHeaders.set(
        'Authorization', this.sessionService.token ? 'Bearer ' + this.sessionService.token : ''
      );
      return httpHeaders;
  }

  get(httpArgs: HttpArgs): any {
    httpArgs = new HttpArgs(httpArgs);
    if (httpArgs.auth) {
      httpArgs.httpHeaders = this.makeAuthHttpHeader(httpArgs.httpHeaders);
    }
    return this.http.get(
      httpArgs.apiEndPoint,
      {
        headers: httpArgs.httpHeaders,
        params: new HttpParams(httpArgs.data),
        observe: 'response'
      },


    );
  }
  post(httpArgs: HttpArgs): any {
    httpArgs = new HttpArgs(httpArgs);
    if (httpArgs.auth) {
      httpArgs.httpHeaders = this.makeAuthHttpHeader(httpArgs.httpHeaders);
    }
    return this.http.post(
      httpArgs.apiEndPoint,
      httpArgs.data,
      {
        headers: httpArgs.httpHeaders,
        observe: 'response'
      },
    );
  }
}
