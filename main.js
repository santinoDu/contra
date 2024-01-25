import {
  map,
  Subject,
  scan,
  interval,
  combineLatest,
  share,
  animationFrameScheduler,
  mergeWith,
  startWith,
  withLatestFrom,
} from 'rxjs';
import './style.css'
import './src/stream/keyboard';
import { keyboard$  } from '@/stream/keyboard';
import { loaderLevel } from '@/loaders/level';
import { LOAD_SOURCE } from '@/types';
import {render} from '@/render';
import { entityInScreen, getNewEntity, screenFit } from '@/utils';
import { joystick$ } from '@/stream/joystick';
import { cheats$ } from '@/stream/cheats';


const canvas = document.getElementById('canvas')
const winWidth = window.innerWidth
const winHeight = window.innerHeight
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
        
screenFit(canvas, winWidth, winHeight, canvasWidth, canvasHeight)
// canvas.setAttribute('width', winWidth)
// canvas.setAttribute('height', winHeight)

const ctx = canvas.getContext('2d');

ctx.font = 'bold 24px verdana, sans-serif'
ctx.fillStyle = '#fff'
ctx.fillText(`点击开始游戏`, canvasWidth / 2 - 60, canvasHeight / 2)

const clear = () => {
  ctx.clearRect(0, 0, winWidth, winHeight)
}

window.debug = true;

// joystick$.subscribe(res => {
//   console.log('res', res)
// })

// keyboard$.subscribe(res => {
//   console.log('key bor', res)
// })

const keyboardMerged$ = keyboard$.pipe(
  mergeWith(joystick$)
);


const main = () => {
  const FPS = 60;
  const frame$ = interval(1000 / FPS, animationFrameScheduler);
  
  const mainData$ = new Subject().pipe(
    scan((prev, current) => {
      let updates = {};
      if (current.gc) {
        updates = {
          updates: getNewEntity(prev.updates),
          enemyBullets: getNewEntity(prev.enemyBullets),
          contraBullets: getNewEntity(prev.contraBullets),
        }
      }
      const sourceLoading = current.sourceLoading
      if (sourceLoading) {
        const name = sourceLoading?.value?.name;
        const value = sourceLoading.value;
        if (name === 'background') {
          updates.backgroundWidth = value.width;
          updates.backgroundHeight = value.height;
        }
        prev.source[name] = value;
        prev.source.loadedCount = sourceLoading.loadedCount;
        prev.source.total = sourceLoading.total;
        return Object.assign(prev, updates);
      }
      return Object.assign(prev, current, updates);
    }, {})
  );
  const loaderSource$ = loaderLevel(1);

  loaderSource$.subscribe(item => {
    mainData$.next({sourceLoading: item});
  });

  const gc$ = interval(50).subscribe(() => {
    mainData$.next({
      gc: true,
    })
  });

  cheats$.subscribe(res => {
    if (res) {
      console.log('whosyourdaddy')
      mainData$.next({
        cheats: true,
        lifes: 30,
      })
    }
  })

  const stream$ = frame$.pipe(
    withLatestFrom(mainData$, keyboardMerged$.pipe(startWith(null)))
  ).subscribe(render);
  // combineLatest([mainData$, keyboard$.pipe(startWith(null)), frame$])
  //   .subscribe(render);

  mainData$.next({
    scene: 'loading',
    ctx,
    FPS,
    canvas,
    cheats: false,
    width: canvas.width,
    height: canvas.height,
    backgroundWidth: 0,
    backgroundHeight: 0,
    deltaX: 0,
    clear,
    lifes: window.debug ? 30 : 2,
    score: 0,
    gc: false,
    mainData$,
    stream$,
    source: {},
    type: LOAD_SOURCE,
    enemyBullets: [],
    contraBullets: [],
    canvasWidth,
    canvasHeight,
    updates: [],
    inScreen: entityInScreen(canvas.width, canvas.height)
  })
}

const start = () => {
  document.body.removeEventListener('click', start);
  main();
}
document.body.addEventListener('click', start);


// loaderLevel(1).pipe(
//   scan((res, cuurent) => {
//     const {value, count} = cuurent;
//     const type = value.type;
//     if (type === 'image') {
//       res.image[value.name] = value;
//     }
//     if (type === 'music') {
//       res.mainTitle = value.music;
//     }
//     res.loaded = res.loaded + 1;
//     res.count = count;
//     return res;
//   }, {image: {}, loaded: 0, total: 100})
// ).subscribe(res => {
//   res.mainTitle.playAudio('mainTitle', true);
//   const contra = new Contra({
//     // ...contraOption,
//     y: 600,
//     x: 150,
//     winWidth,
//     winHeight,
//     keyboard$: keyboard$.pipe(share()),
//     // sprite:
//   });
//   frame$
//     .pipe(
//       withLatestFrom(keyboard$),
//       tap(() => {
//         draw()
//         level.images.forEach(item => {
//           item.position.forEach(([x, y, count = 1]) => {
//             for (let i = 0; i < count; i++) {
//               ctx.drawImage(
//                 item.buffer,
//                 x + i * item.width,
//                 y,
//                 item.width,
//                 item.height
//               )
//             }
//           })
//         })
        
//         contra.update(ctx);
//       })
//   ).subscribe(x => {});
// })
// // const pageLoading$ = 


