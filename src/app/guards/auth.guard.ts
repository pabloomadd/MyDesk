import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const routerInject = () => inject(Router);
export const authStateObs$ = () => inject(AuthService).authState$;

export const authGuard: CanActivateFn = (route, state) => {

  const router = routerInject();
  return authStateObs$().pipe(
    map((user) => {
      if (!user) {
        router.navigate([''])
        return false;
      } else {
        return true;

      }
    })
  )

};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = routerInject();
  return authStateObs$().pipe(
    map((user) => {
      if (user) {
        router.navigate(['/home'])
        return false
      }
      return true
    })
  )
};