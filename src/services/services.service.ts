import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { WebData } from './web-data.dto';
@Injectable({
  providedIn: 'root'
})
export class ServicesService  {
 
  
  authLink = environment.authLink;
  constructor(private http: HttpClient) { }


  createData():Observable<any>{
    return this.http.get<string[]>(`${this.authLink}/data`);
  }

  postData(data:WebData):Observable<WebData>{

    // const me=JSON.parse(localStorage.getItem('coordinates'));
    console.log("values of coordinates",data);
    return this.http.post<WebData>(`${this.authLink}/data`,data);
  }

  postLocation(data:any):Observable<any>{
    console.log("address",data);
    return this.http.post<any>(`${this.authLink}/data/getLocation`,data);
  }
}
