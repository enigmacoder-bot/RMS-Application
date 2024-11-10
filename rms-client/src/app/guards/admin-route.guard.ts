import { CanActivateFn } from '@angular/router';

export const adminRouteGuard: CanActivateFn = (route, state) => {
  return true;
};
