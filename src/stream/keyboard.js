import {
  map,
  from,
  scan,
  mergeAll,
  fromEvent,
} from 'rxjs';

const keyEvents = ['keydown', 'keyup'];

const keyValues = {
  KeyW: 1,
  KeyS: -1,
  KeyA: -3,
  KeyD: 3,
};

const directionKeys = Object.keys(keyValues);

const directionMap = {
  1: 'top',
  2: 'bottomRight',
  3: 'right',
  4: 'topRight',
  '-1': 'bottom',
  '-2': 'topLeft',
  '-3': 'left',
  '-4': 'bottomLeft',
};

const actionMap = {
  'KeyJ': 'A',
  'KeyK': 'B',
}


export const keyboard$ = from(keyEvents.map(keyEvent => {
  return fromEvent(document, keyEvent)
}))
  .pipe(
    mergeAll(),
    scan(({keyDownMap}, e) => {
      keyDownMap[e.code] = e.type === 'keydown';
      const active = e.type === 'keydown' ? e.code : '';
      return {keyDownMap, type: e.type, active}
    }, {keyDownMap: {}}),
    map(({keyDownMap, type, active}) => {
      const value = directionKeys.reduce((result, key) => {
        if (keyDownMap[key]) {
          return result + keyValues[key]
        }
        return result;
      }, 0);
      return {
        type,
        A: keyDownMap.KeyJ,
        B: keyDownMap.KeyK,
        direction: directionMap[value],
        directionValue: value,
        active,
      };
    })
  );

