import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class WebEmpathService {

  apiUrl: string = 'https://api.webempath.net/v2/analyzeWav';

  constructor(private http: HttpClient) {}

  getUserEmotion(formData) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'multipart/form-data');
    return this.http.post(this.apiUrl, formData);
  }

}