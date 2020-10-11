import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(private httpClient: HttpClient) { }

  public apiURL = 'http://localhost:7028/';
    public getDiagram(configdata:any){
      return this.httpClient.post(`${this.apiURL}petri_diagram/petri_to_json`,configdata,{headers: {'Content-Type': 'application/json'}});
    };
}
