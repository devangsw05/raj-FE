import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RestApiService } from '../services/rest-api.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Timestamp } from "firebase/firestore"


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  data: any;

  


  constructor(private restApi: RestApiService) {}
  ngOnInit(): void {
   this.restApi.getAttedanceData().subscribe(x=>{
    console.log(x)
    this.data = x;

    for(let i=0; i<=this.data.length ; i++){
      const timeObj = new Timestamp(this.data[i]?.timeStamp?._seconds, this.data[i]?.timeStamp?._nanoseconds);
      console.log(timeObj.toDate());
    }
   })
  }

  public ConvertImeStampToDate(timeStamp: any) {
    const timeObj = new Timestamp(timeStamp?._seconds, timeStamp?._nanoseconds);
    return timeObj.toDate();
  }
  title = 'raj-FE';
}
