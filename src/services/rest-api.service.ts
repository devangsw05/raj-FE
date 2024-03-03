import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
  })
  export class RestApiService {



    apiURL = 'https://raj-project.onrender.com/attendance';

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    constructor(private http: HttpClient) {}

    public getAttedanceData() {
    return  this.http.get<any>(this.apiURL)
    }
  }