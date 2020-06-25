import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  // we declare that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class RandomService {
  constructor(private http: HttpClient) { 

  }

  getRandom(min: number, max: number, count: number) {
    let url = `https://www.random.org/integers/?num=${count}&min=${min}&max=${max}&col=${count}&base=10&format=plain&rnd=new`
    return this.http.get(url, {responseType: "text"});
  }

}