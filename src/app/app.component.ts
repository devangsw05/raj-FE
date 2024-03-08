import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RestApiService } from '../services/rest-api.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  data: any;

  displayData: any;

  currentPage = 1;

  itemsPerPage = 5;

  totalPages: number = 1;

  nameFilter: string = '';

  classFilter: string = '';

  dateFilter: string = '';

  constructor(private restApi: RestApiService) {}
  ngOnInit(): void {
    this.restApi.getAttedanceData().subscribe((x) => {
      this.data = x;
      this.sortArray(this.data)

      this.totalPages = Math.ceil(this.data?.length / this.itemsPerPage);

      if (this.data?.length > this.itemsPerPage) {
        this.displayData = this.data.slice(0, this.itemsPerPage);
      }
    });
  }


  public ConvertImeStampToDate(timeStamp: any) {
    const timeObj = new Timestamp(timeStamp?._seconds, timeStamp?._nanoseconds);
    return timeObj.toDate();
  }

  public counter(i: number) {
    return new Array(i);
  }

  public goToPage(pageNumber: number) {
    if (pageNumber > this.totalPages) {
      pageNumber = this.totalPages;
    } else if (pageNumber < 1) {
      pageNumber = 1;
    } else {
      this.currentPage = pageNumber;
    }

    //update data
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayData = this.data.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  filterData() {
    let filteredData = this.data.filter(
      (d: any) =>
        d.name.includes(this.nameFilter) &&
        d.className.includes(this.classFilter)
    );

    if (this.dateFilter) {
      console.log(typeof this.dateFilter);
      filteredData = filteredData.filter((fd: any) => {
        const timeObj = new Timestamp(
          fd.timeStamp?._seconds,
          fd.timeStamp?._nanoseconds
        );
        const fDate = new Date(this.dateFilter);
        return timeObj.toDate().getDate() === fDate.getDate();
      });
    }

    this.totalPages = Math.ceil(filteredData?.length / this.itemsPerPage);
    this.currentPage = 1;
    this.displayData = filteredData.slice(0, this.itemsPerPage);
  }

  resetData() {
    this.nameFilter = this.classFilter = this.dateFilter = '';
    this.totalPages = Math.ceil(this.data?.length / this.itemsPerPage);
    this.currentPage = 1;
    if (this.data?.length > this.itemsPerPage) {
      this.displayData = this.data.slice(0, this.itemsPerPage);
      console.log(this.data.slice(3, 3));
    }
  }

  sortArray(unSortedData: any, field?:string): any {
     unSortedData.sort((a: any, b:any) => this.compare(a,b));
     return unSortedData;
  }

  compare( a:any, b:any , field?: string) {
    field = field ? field : 'timeStamp';
    
    if(field === 'timeStamp') {

      const atimeObj = new Timestamp(a?.timeStamp?._seconds, a?.timeStamp?._nanoseconds);
      const btimeObj = new Timestamp(b?.timeStamp?._seconds, b?.timeStamp?._nanoseconds);
      let bb=   btimeObj.toDate().getTime() - atimeObj.toDate().getTime();
      return bb;
    }
    return a[field] - b[field];
  }

  title = 'raj-FE';
}
