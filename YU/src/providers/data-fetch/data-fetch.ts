import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AirQ } from '../../AirQ';
import { MockData } from '../../mock-airq';
import 'rxjs/add/operator/map';

/*
  Generated class for the DataFetchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataFetchProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DataFetchProvider Provider');
  }
  apiUrl = 'http://127.0.0.1:3000'
  getList(): AirQ[]{
    return MockData
  }

  getLiveData(location: String): any{
    this.http.get(this.apiUrl + '/get-data?location=' + location).subscribe(data => {
      return data;
  },
  err => {
      console.log("Oops!");
  });
  }

}
