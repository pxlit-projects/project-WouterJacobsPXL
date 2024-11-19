import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

export const authenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    snackBar.open('Please log in to access this page', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
    router.navigate(['/login']);
    return false;
  }

    if (userRole != "author") {
      snackBar.open(`Only authors can access this page`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      router.navigate(['/']);
      return false;
    }

  return true;
};
