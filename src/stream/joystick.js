import { fromEvent, merge, tap, map, delay, mergeWith, scan } from 'rxjs';

const cursor = document.getElementById('cursor'); 
const circle = document.getElementById('circle');

const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
// const circleWidth = winWidth * 0.174;
const circleWidth = 160;
circle.style.width = circleWidth + 'px';
circle.style.height = circleWidth + 'px';

const circleRect = circle.getBoundingClientRect()
const circlePoint = [circleRect.left + circleRect.width / 2, circleRect.top + circleRect.height / 2];

const cursorRect = cursor.getBoundingClientRect()
const cursorPoint = [cursorRect.left + cursorRect.width / 2, cursorRect.top + cursorRect.height / 2];

const getJoyStickTouch = (touches) => {
  return [...touches].sort((a, b) => a.pageX - b.pageX)[0];
}

const getPos = e => {
  const touch = getJoyStickTouch(e.touches);
  return {x: touch.pageX, y: touch.pageY};
}

const touchstart$ = fromEvent(circle, 'touchstart')
const touchmove$ = fromEvent(circle, 'touchmove')
const touchend$ = fromEvent(circle, 'touchend')

const keyBtns = document.getElementById('key_btns');

const getDefaultKeys = () => ({A: !1, B: !1, C: !1, keys: true});

const keyRelease$ = fromEvent(keyBtns, 'mouseup').pipe(
  map(_ => ({A: !1, B: !1, C: !1, keys: true})),
  delay(200),
);
// click 在touch事件时无法触发
const keyEvent$ = fromEvent(keyBtns, 'touchstart').pipe(
  map(e => e.target.getAttribute('data-value')),
  map(v => (Object.assign(getDefaultKeys(), {[v]: !0}))),
  mergeWith(keyRelease$),
);


const getAbsDist= (arr1,arr2) => arr1.map((x,i) => Math.abs(x - arr2[i]));
const getDiaDist = (x,y) => Math.sqrt((x*x) + (y*y)); 

const range = circleRect.width / 2;

const getAngle = moveEvent => {
  const { x, y } = getPos(moveEvent)
  return Math.atan2(cursorPoint[1] - y, x - cursorPoint[0]) * 180 / Math.PI
}

const codesMap = [
  { key: 'right', match: n => n >=-22.5 && n < 22.5 },
  { key: 'topRight', match: n => n >= 22.5 && n < 67.5 },
  { key: 'top', match: n => n >= 67.5 && n < 112.5 },
  { key: 'topLeft', match: n => n >= 112.5 && n < 157.5 },
  { key: 'left', match: n => n >= 157.5 || n < -157.5 },
  { key: 'bottomLeft', match: n => n >= -157.5 && n < -112.5 },
  { key: 'bottom', match: n => n >= -112.5 && n < -67.5 },
  { key: 'bottomRight', match: n => n >= -67.5 && n < -22.5 },
];

const getKeyCode = e => {
  if (e.type === 'touchend') {
    return ''
  }
  const angle = getAngle(e);
  for (let i = 0; i < codesMap.length; i++) {
    const item = codesMap[i];
    if (item.match(angle)) {
      return item.key;
    }
  }
}

const directionMap = {
  'top': 1,
  'bottomRight': 2,
  'right' :3,
  'topRight': 4,
  'bottom': -1,
  'topLeft': -2,
  'left': -3,
  'bottomLeft': -4,
};

export const joystick$ = merge(touchstart$, touchmove$, touchend$).pipe(
  tap(e => {
    if (e.type === 'touchend') {
      return cursor.style.transform = `translate3d(0, 0, 0)`
    }
    e.preventDefault();

    const touch = getJoyStickTouch(e.touches);
    const { pageX, pageY } = touch;
    const dist = getDiaDist(...getAbsDist(cursorPoint, [ pageX, pageY ]));
    const unit = {};
    if (dist < range) {
      unit.x = pageX;
      unit.y = pageY;
    } else {
      const rate = range / dist;
      const [ x, y ] = cursorPoint;
      unit.x = x + (pageX - x) * rate;
      unit.y = y + (pageY - y) * rate;
    }
    cursor.style.transform = `translate3d(${unit.x - cursorPoint[0]}px, ${unit.y - cursorPoint[1]}px, 0)`
  }),
  map(e => getKeyCode(e)),
  map(direction => {
    return {
      A: '',
      B: '',
      direction: direction,
      directionValue: directionMap[direction] || 0,
      type: direction ? 'keydown' : 'keyup',
    }
  }),
  mergeWith(keyEvent$),
  scan((result, e) => {
    if (e.keys) {
      return Object.assign(result, e)
    }
    return e;
  }, {})
);


