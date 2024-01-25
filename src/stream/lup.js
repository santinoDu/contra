//  1up not lup;

import { throttleTime, Subject } from 'rxjs';

export const createLupHandler = () => {
  const lup$ = new Subject()

  lup$.pipe(
    throttleTime(200),
  ).subscribe(({keyboard, data}) => {
    if (keyboard.active === 'ArrowUp') {
      data.source.soundEffects.audio.playAudio('lup');
      data.mainData$.next({
        lifes: data.lifes + 1,
      })
    }
  })

  return lup$;
}

