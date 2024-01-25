import { throttleTime, Subject } from 'rxjs'
import { contraSprite } from '@/sprite/contra'
import { loadSprite } from '@/loaders/sprite'
import { loadAudioBoard } from '@/loaders/audioBoard'
import { audioSource } from '@/config/audio';
import { createCanvas } from '@/utils/canvas';
import { getTime, blink } from '@/utils/';
import { GunM, GunS } from '@/guns/gunM';
import { Jump } from '@/traits/Jump';
import { Move } from '@/traits/Move';
import { Landing } from '@/traits/Landing';
import { Entity } from './Entity';

// 

// loadSprite(contraSprite).then(res => {
//   console.log('resss', res)
// })

export function loadContra() {
  // return Promise.all([
  //   loadSprite(contra),
  //   loadAudioBoard(audioSource)
  // ]).then(([sprite, audio]) => {
  //   return {sprite, audio};
  // })

  // const contraSprite = loadSprite(contra)
  // const audioBoard$ = loadAudioBoard(audioSource)

  // const contraAssets$ = [contraSprite, audioBoard$];

  // return {
  //   assetsCount: [toArray(audioBoard$), contraSprite].length,
  //   stream$: contraAssets$.pipe(
  //     mergeAll()
  //   ).subscribe((res) => {
  //   })
  // }
}

export function createContraFactory() {

  const routeFrame = ({
    ctx,
    keyboard,
    entity,
    animations,
    jumpTrait,
    moveTrait,
  }) => {
    const direction = keyboard.direction || '';
    
    if (direction.includes('ight')) {
      entity.face = 'right';
    } else if (direction.includes('eft')) {
      entity.face = 'left';
    }

    if (entity.jumpping) {
      entity.setJumpRect();
      return jumpTrait.getFrame();
    }

    // entity.resetRect();

    if (direction) {
      
      let formatDir = direction
      if (entity.face === 'left') {
        if (direction === 'top') {
          formatDir = 'leftTop'
        } else if (direction === 'bottom') {
          formatDir = 'leftBottom'
        }
      }
      return moveTrait.getFrame(animations[formatDir]);
    }
    
    const face = entity.face === 'right' ? 'forward' : 'backward';

    return animations[face][0];
  }
  const bullet$ = new Subject();

  const fall$ = new Subject();

  return function(opts) {
    const data = opts.data || {};

    const animations = opts.image.animations;

    const contra = new Entity();
    contra.addTrait('jump', new Jump({
      frames: opts.image.animations.jumpping
    }));
    contra.addTrait('move', new Move());
    contra.addTrait('landing', new Landing({
      groundCoordinates: data.groundCoordinates
    }));

    contra.x = opts.x
    contra.y = opts.y
    contra.originWidth = 24;
    contra.originHeight = 34;
    contra.width = 0
    contra.height = 0
    contra.sounds = opts.sounds
    contra.image = opts.image
    contra.face = 'right';
    contra.type = 1;
    contra.name = 'contra';
    contra.dying = false;
    contra.weaponType = data.cheats ? 2 : 1; // 1:M  2:S
    contra.bornTime = getTime();
    contra.invincible = true;

    contra.bottomWidth = 33;
    contra.bottomHeight = 17;
    contra.bottomY = contra.originHeight - contra.bottomHeight;
    contra.crawling = false;
    contra.lastDirection = '';

    const mainData$ = data.mainData$;
    
    contra.resetRect = () => {
      contra.width = contra.originWidth
      contra.height = contra.originHeight
    }

    contra.setJumpRect = () => {
      contra.width = 20
      contra.height = 20
    }

    contra.setCrawRect = () => {
      contra.width = 33;
      contra.height = 17;
    }

    setTimeout(() => {
      contra.invincible = false;
    }, 2000);

    bullet$.pipe(
      throttleTime(200),
    ).subscribe(config => {
      contra.sounds.playAudio(contra.weaponType === 2 ? 'gunS' : 'gunM')
      const bullet = contra.weaponType === 2 ? GunS(config) : [new GunM(config)]
      mainData$.next({
        contraBullets: data.contraBullets.concat(bullet).filter(item => {
          return !item.remove;
        })
      })
    });
    contra.landed = (h, land) => {
      contra.resetRect();
      contra.jumpping = false;
      contra.y = h - contra.originHeight;
      contra.land = land;
    };
    
    const jumpTrait = contra.getTrait('jump');
    const moveTrait = contra.getTrait('move');
    
    contra.setFall = (falling) => {
      if (falling) {
        contra.y += 20
      }
      jumpTrait.start(contra, -1);
    }

    contra.godie = () => {
      // 增加remove条件防止把dying重置为true
      if (!contra.dying && !contra.remove && !contra.invincible) {
        contra.sounds.playAudio('death');
        contra.dying = true;
        setTimeout(() => {
          contra.remove = true;
        }, 1000);
      }
    }

    fall$.pipe(
      throttleTime(200)
    ).subscribe((down) => {
      contra.setFall(down)
    });

    fall$.next()
    contra.fall$ = fall$;
    contra.update = (ctx, keyboard) => {
      
      if (keyboard.active === 'KeyL') {
        contra.sounds.playAudio('youarenotprepared', !1, !0);
      }
      if (!contra.dying) {
        const inScreen = data.inScreen(contra);
        if (!inScreen) {
          contra.godie()
        }
        
        const direction = keyboard.direction || '';

        if (keyboard.B) {
          if (direction.includes('ottom')) {
            if (!contra.land?.fallDisabled) {
              fall$.next(true)
            }
          } else {
            jumpTrait.start(contra);
          }
        }
        contra.getAllTraits().forEach(trait => {
          trait.update(contra, keyboard, animations, data)
        })
        // jumpTrait.update(contra);
        const frame = routeFrame({
          ctx,
          keyboard,
          entity: contra,
          animations,
          jumpTrait,
          moveTrait,
        })
        
        if (keyboard.A) {
          let direTemp = direction;
          if ((direction === 'bottom' && !contra.jumpping) || !direction) {
            direTemp = contra.face;
          }
          bullet$.next({
            buffer: opts.image.tiles.gunM,
            x: contra.x,
            y: contra.y + 8,
            direction: direTemp,
            ctx,
            canvasWidth: data.canvasWidth,
            canvasHeight: data.canvasHeight
          })
        }
        const center = Math.floor(data.width / 2);
        const maxDeltaX = -data.backgroundWidth + data.width
        let newDeltaX
        if (direction.includes('ight') && contra.x > center) {
          const deltaX = contra.x - center;
          newDeltaX = Math.max(data.deltaX - deltaX, maxDeltaX)
          mainData$.next({
            deltaX: newDeltaX
          })
        }
        if (newDeltaX === maxDeltaX || maxDeltaX === data.deltaX) {
          contra.x = Math.max(contra.x, 20)
        } else {
          contra.x = Math.min(Math.max(contra.x, 20), center)
        }

        if (direction === 'bottom' && contra.lastDirection !== direction) {
          contra.setCrawRect()
          contra.y += contra.bottomY;
        } else if (direction !== 'bottom' && contra.lastDirection === 'bottom') {
          contra.resetRect();
          contra.y -= contra.bottomY;
        }
        contra.lastDirection = direction;

        const renderFrame = !(contra.invincible && Math.floor((getTime() - contra.bornTime) / 100) % 2)
        if (renderFrame) {
          ctx.drawImage(frame, contra.x, contra.y)
        }
      }
      
      data.contraBullets.forEach(bullet => {
        bullet.update();
      })
    }

    return contra;
  }
}

// export class Contra extends Entity {
//   constructor(opts) {
//     this.x = opts.x
//     this.y = opts.y
//     this.gravity = 1
//     this.jumpping = false
//     this.direction = 1
//     this.lastDirection = 1;
//     // this.jump

//   }

//   jump() {
//     if (this.jumpping) {
//       return;
//     }
//     this.jumpStartTime = performance.now();
//     this.jumpping = true;

//     this.y -= 1;
//     this.acceleration = 18;
//     this.setAnimation('jumpping');
//   }

//   update(ctx, keyboard) {
//     const { A, B, direction } = keyboard;
//     // {type: 'keyup', A: false, B: undefined, direction: undefined}
//     if (B) {
//       this.jump();
//     } else if (!this.jumpping) {

//     }
//   }
// }

// export class Contra1 {
//   constructor (opts){
//     this.sprite = opts.sprite;
//     this.audioBoard = opts.audio;
//     this.keyboard$ = opts.keyboard$;
//     this.x = opts.x;
//     this.y = opts.y;
//     this.winWidth = opts.winWidth;
//     this.winHeight = opts.winHeight;
//     this.acceleration = 0; // 起跳加速度
//     this.gravity = 1; // 重力
//     this.jumpping = false;
//     this.direction = 1;
//     this.keys = {};
//     this.setupKeyboard();
//     this.lastDirection = 'forward';
//     this.animationsFrames = [];
//     this.frameIndex = 0;
//     this.falling = false; // 空中状态
//     this.animStartTime = Date.now();
//     // const image = this.sprite.image;
//     // this.image = image;
//     // this.canvas = createCanvas(image, image.width, image.height)
//     // this.context = this.canvas.getContext('2d');

//     this.animations = {}
//     this.animationType = 'forward';
//   }


//   setupKeyboard() {
//     this.keyboard$.subscribe(keys => {
//       this.keys = keys;
//     })
//   }

//   setAnimation(animation) {
//     if (this.animationType !== animation) {
//       this.animStartTime = Date.now()
//       this.animationType = animation;
//     }
    
//   }

//   jump() {
//     if (this.jumpping) {
//       return;
//     }
//     this.jumpping = true;
//     this.y -= 1;
//     this.acceleration = 18;
//     this.setAnimation('jumpping');
//   }

//   drawImage(ctx) {
//     const animations = this.sprite.animations;
//     const action = animations[this.animationType];
//     const actionLength = action.length;
//     const frameIndex = Math.ceil((Date.now() - this.animStartTime) / 50) % actionLength

//     const frame = animations[this.animationType][frameIndex];
//     // if ( true) {
//     //   ctx.scale(-1, 1);
//     //   ctx.translate(-frame[2], 0);
//     // }
//     const buffer = animations[this.animationType][frameIndex];
//     const bufferWidth = buffer.width;
//     const bufferHeight = buffer.height;
//     // sx,sy为buffer，不要误认为是sprite图片的sx，sy
//     ctx.drawImage(frame, 0,
//       0,
//       bufferWidth,
//       bufferHeight,
//       this.x - bufferWidth,
//       this.y - bufferHeight,
//       bufferWidth * 2,
//       bufferHeight * 2)
//   }

//   update(ctx) {
//     const { direction, A, B } = this.keys;
//     let directionFix = direction;

//     if (B) {
//       this.jump();
//     } else if (!this.jumpping) {
//       if (direction === 'left') {
//         this.lastDirection = 'backward'
//       } else if (direction === 'right') {
//         this.lastDirection = 'forward'
//       }
  
//       if (this.lastDirection === 'backward') {
//         if (direction === 'top') {
//           directionFix = 'leftTop'
//         } else if (direction === 'bottom') {
//           directionFix = 'leftBottom'
//         }
//       }

  
//       const frames = this.sprite.animations[directionFix];

//       if (frames) {
//         if (this.animationType !== directionFix) {
//           this.setAnimation(directionFix);
//         }
//       } else {
//         this.setAnimation(this.lastDirection);
//       }
//     }
   
    
//     if (A) {
//       this.audioBoard.playAudio('gunS')
//       new GunM({
//         buffer: this.sprite.tiles.gunM,
//         x: this.x,
//         y: this.y,
//         direction: directionFix,
//         ctx,
//         winWidth: this.winWidth,
//         winHeight: this.winHeight
//       })
//     }

//     if (this.y < 580) {
//       this.falling = true;
//     } else {
//       this.jumpping = false;
//       this.falling = false;
//       this.y = 580;
//     }

//     const forward = ['right', 'topRight', 'bottomRight']
//     const backward = ['left', 'topLeft', 'bottomLeft']

//     if (forward.includes(direction)) {
//       this.x = this.x + 4;
//     } else if (backward.includes(direction)) {
//       this.x = this.x - 4;
//     }
    
//     if (this.falling || this.jumpping) {
//       this.y = this.y - this.acceleration;
      
//       this.acceleration = this.acceleration - this.gravity;

//     }
//     this.drawImage(ctx);
//   }

// }
