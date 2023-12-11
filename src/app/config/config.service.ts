import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // linkedinAccessTokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
  constructor(private http: HttpClient) { }

  // getForAccessToken1234() {
  //   return this.http.get<Config>(this.linkedinAccessTokenUrl);
  // }

  // getForAccessToken(linkedinAccessTokenUrl) {
  //   // return this.http.post(linkedinAccessTokenUrl)
  //   //   .pipe(
  //   //     catchError(this.handleError)
  //   //   );
  //       this.http.post<any>('https://www.linkedin.com/oauth/v2/accessToken', { code: 'Angular POST Request Example' })
  //       .subscribe(data => {
  //           this.postId = data.id;
  //       })
  // }



  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
