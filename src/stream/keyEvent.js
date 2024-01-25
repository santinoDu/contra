import { fromEvent, merge, timer } from "rxjs";
import { takeUntil, map, switchMap } from 'rxjs/operators';

const steeringTime$ = timer(0, 50);

export const keyEvent$ = merge(...['KeyA', 'KeyB'].map(key => {
  const el = document.getElementById(key);
  const keyDown$ = fromEvent(el, 'touchstart');
  const keyUp$ = fromEvent(el, 'touchend');
  return keyDown$.pipe(
    switchMap(() => {
      return steeringTime$.pipe(
        map(() => key),
        takeUntil(keyUp$),
      )
    })
  )
}));

keyEvent$.subscribe(x => {
  console.log('x', x)
})
