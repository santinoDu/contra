import { Subject, tap, bufferCount, distinctUntilChanged, mergeMap, from, sequenceEqual } from 'rxjs';
const codes = from([
  'top',
  'top',
  'bottom',
  'bottom',
  'left',
  'right',
  'left',
  'right',
  'KeyB',
  // 'KeyA',
  // 'KeyB',
  // 'KeyA',
]);

export const cheatsSubject$ = new Subject()

let flag = false;
export const cheats$ = cheatsSubject$.pipe(
  distinctUntilChanged((prev, curr) => {
    let result = false;
    if (prev === curr) {
      if (['top', 'bottom'].includes(curr)) {
        if (flag) {
          result = true;
        }
        flag = true;
      } else {
        result = true;
      }
    } else {
      flag = false
    }
    return result;
  }),
  bufferCount(9, 1),
  mergeMap(last9 => from(last9)
    .pipe(sequenceEqual(codes))
  )
);
