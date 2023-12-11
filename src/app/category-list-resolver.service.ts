import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserAuthService } from 'src/app/user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryListResolverService implements Resolve<any>{

  constructor(private userService: UserAuthService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    console.log('Called Get Product in resolver...', route);
    return this.userService.getcategorylist().pipe(
      catchError(error => {
        return of('No data');
      })
    );
  }
}
