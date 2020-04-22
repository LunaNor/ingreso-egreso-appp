import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor ( private authService: AuthService,
                private router: Router) {}
  // el canActivate puede retornar un oservable que retorna un booleano, una promesa que retorna un booleano o un simple boolean
  // y de esa manera puedo saber si puede pasar o no la persona
  canActivate(): Observable<boolean> {
    return this.authService.isAuth().pipe(
      tap( estado => {
        if (!estado) {this.router.navigate(['/login'])}
      })
    );
  }

  canLoad(): Observable<boolean> {
    return this.authService.isAuth().pipe(
      tap( estado => {
        if (!estado) {this.router.navigate(['/login'])}
      }),
      take(1) // solo será una suscripcion
    );
  }

   


  
}
