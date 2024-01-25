import { 
  LOAD_SOURCE,
  START_PAGE,
  START_PAGE_ANIMATION,
  START_PAGE_COMPLETE,
  START_PAGE_BLINK,
  LEVEL_1,
 } from '@/types';
import { animation, blink, checkCollision, drawLifes } from '@/utils/index';
import { drawLine, drawBoard, drawHpBar } from '@/utils/canvas';
import { createContraFactory } from '@/entities/Contra';
import { createEagle } from '@/entities/Eagle';
import { createEnemyFactory } from '@/entities/Enemy';
import { loadSprite } from '@/loaders/sprite'
import { contraSprite, eagleSprite } from '@/sprite/contra'
import { enemySprite } from '@/sprite/enemy'
import { kunSprite } from '@/sprite/kun'
import { groundCoordinates } from '@/background/';
import { createLupHandler } from '@/stream/lup';
import { enemyController } from '@/enemyController';
import { cheatsSubject$ } from '@/stream/cheats';


const draw = (winWidth, winHeight) => {
  ctx.clearRect(0, 0, winWidth, winHeight)
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, winWidth, winHeight);
}

const drawStartImage = function(data) {
  const startSource = data.source.start;
  const buffer = startSource.buffer
  data.ctx.drawImage(buffer, 0, 0, buffer.width, buffer.height, 0, 0 , 300, 225);
}

const drawStartText = function (ctx, width, height) {
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#fff'
  ctx.fillText(`点击A或键盘J键开始`, width / 2 - 80, height - 30)
}

const musicPlay = (data, name, loop) => {
  data.source.mainTitle.music.playAudio(name, loop)
}

const audioPlay = (data, name) => {
  data.source.soundEffects.audio.playAudio(name)
}

export const render = ([timer, data, keyboard]) => {
  const {
    ctx,
    clear,
    width,
    height,
    type,
    source,
    mainData$,
    canvasWidth,
    canvasHeight,
    updates,
    deltaX,
  } = data;
  clear();

  const renderMap = {
    [LOAD_SOURCE]: () => {
      const loadedCount = source?.loadedCount;
      const total = source?.total;
      let percent = 0;
      if (total && loadedCount) {
        percent = Math.floor(loadedCount / total * 100);
      }
      ctx.font = 'bold 24px verdana, sans-serif'
      ctx.fillStyle = '#fff'
      ctx.fillText(`${percent}%`, width / 2 - 30, height / 2)
      // ctx.fillText(`资源加载:${percent}%`, width / 2 - 80, height / 2)
      
      if (percent === 100) {
        console.log('data', data)
        loadSprite(eagleSprite).then(res => {
          mainData$.next({
            eagle: res
          });
        });
        loadSprite(enemySprite).then(res => {
          mainData$.next({
            enemySprite: res,
          });
        });
        loadSprite(kunSprite).then(res => {
          mainData$.next({
            kunSprite: res,
          });
        });
        loadSprite(contraSprite).then(res => {
          mainData$.next({
            contraSpirte: res
          });
        });
        mainData$.next({
          type: START_PAGE,
          groundCoordinates,
        });
        musicPlay(data, 'beginning');
      }
    },
    [START_PAGE]: () => {
      const startSource = data.source.start;

      const startLoading = animation({
        ctx,
        img: startSource.buffer,
        imgWidth: startSource.width,
        imgHeight: startSource.height,
        startPos: {
          x: 300,
          y: 0
        },
        endPos: {
          x: 0,
          y: 0
        },
        // duration: 5500,
        duration: 2000,
        done: () => {
          mainData$.next({
            type: START_PAGE_COMPLETE
          });
        },
        rect: [300, 225],
      });
      mainData$.next({
        startLoading,
        type: START_PAGE_ANIMATION
      });
    },
    [START_PAGE_ANIMATION]: () => {
      const startLoading = data.startLoading;
      if (startLoading) {
        startLoading();
      }
    },
    [START_PAGE_COMPLETE]: () => {
      drawStartImage(data);
      drawStartText(ctx, width, height);
      if( keyboard?.direction) {
        cheatsSubject$.next(keyboard.direction)
      }
      if (keyboard?.A || keyboard?.B) {
        if (keyboard.A){
          cheatsSubject$.next('KeyA');
        } else if (keyboard.B){
          cheatsSubject$.next('KeyB');
        }
      }
      if (keyboard?.A) {
        audioPlay(data, 'start');
        const startBlink = blink({
          draw: () => {
            drawStartText(ctx, width, height);
          },
          interval: 300,
          duration: 1500,
          done: () => {
            const contra = createContraFactory()({
              y: 20,
              x: 40,
              sounds: source.soundEffects.audio,
              image: data.contraSpirte,
              keyboard,
              data,
            });

            window.contra = contra;
            window.data = data;
            console.log('window.contra', contra)
            console.log('window.data', data)

            const createEagles = createEagle(data);

            const createEnemy = createEnemyFactory(data);

            mainData$.next({
              type: LEVEL_1,
              createEagles,
              contra,
              createEnemy,
              updates: data.updates.concat(contra),
              lupHandler: createLupHandler(),
            });

            musicPlay(data, 'mainTitle', !0);
            

            // setInterval(() => {
            //   const eagle = data.createEagles(Math.random() > 0.5 ? 2 : 1)
            //   mainData$.next({
            //     updates: data.updates.concat(eagle),
            //   });
            // }, 5000)

          }
        })
        mainData$.next({
          startBlink,
          type: START_PAGE_BLINK
        });
      }
    },
    [START_PAGE_BLINK]: () => {
      drawStartImage(data);
      const startBlink = data.startBlink()
      if (startBlink) {
        startBlink();
      }
    },
    [LEVEL_1]: () => {
      const contra = data.contra;
      const contraRect = {x: contra.x, y: contra.y, width: contra.width, height: contra.height}
      const background = data.source.background;
      let score = data.score;
      ctx.drawImage(background.buffer, 0, 0, background.width, background.height, data.deltaX, 0, background.width, background.height);
      data.updates.forEach(entity => {
        data.contraBullets.forEach(bullet => {
          if (entity.type === 2) {
            const collision = checkCollision(entity.rect, bullet.rect);
            if (entity.name === 'weapon' && entity.status !== 1) {
              if (collision) {
                entity.airborne();
                bullet.remove = true;
              }
            } else {
              if (collision) {
                bullet.remove = true;
                entity.hurt && entity.hurt(bullet.damage, () => {
                  score += entity.score || 1;
                });
                if (entity.hp > 1) {
                  mainData$.next({
                    enemyHpEntity: entity,
                  });
                }
              }
            }
          }
        });
        if (entity.name === 'weapon' && entity.status === 1) {
          if (checkCollision(contraRect, entity)){
            entity.destory();
            contra.sounds.playAudio('obtainWeapon')
            contra.weaponType = entity.weaponType;
          }
        }
      });

      data.enemyBullets.forEach(bullet => {
        if (checkCollision(contraRect, bullet)) {
          contra.godie();
        }
      })

      data.updates.forEach(entity => {
        if (entity.type === 2 && entity.name !== 'weapon') {
          if (checkCollision(contraRect, entity)) {
            contra.godie();
          }
        }
      })

      enemyController(data);

      drawLifes(ctx, data)
      data.lupHandler.next({keyboard, data});


  
      // const newEnemyBullets = getNewUpdates(data.enemyBullets);
      data.enemyBullets.forEach((entity) => entity.update(ctx, keyboard, data));

      const newUpdates = data.updates;
      // const newUpdates = getNewUpdates(data.updates);
      newUpdates.forEach((entity) => entity.update(ctx, keyboard, data));
    
      let lifes = data.lifes;

      if (data.enemyHpEntity && !data.enemyHpEntity.remove && data.enemyHpEntity.hp > 0) {
        drawHpBar(ctx, data.enemyHpEntity.hp, data);
      }

      if (contra.remove) {
        if (lifes > 0) {
          const contra = createContraFactory()({
            y: 20,
            x: 40,
            sounds: source.soundEffects.audio,
            image: data.contraSpirte,
            keyboard,
            data,
          });
          newUpdates.push(contra)
          mainData$.next({
            contra
          });
          lifes -= 1;
        } else {
          data.source.mainTitle.music.pauseAll();
          contra.sounds.playAudio('gameover')
          data.stream$.unsubscribe();
        }
      }

      mainData$.next({
        updates: newUpdates,
        // enemyBullets: newEnemyBullets,
        lifes,
        score,
      });

      ctx.fillText('分数:' + score, 10, 10);

      if (window.debug) {
        ctx.fillStyle = '#fff'
        ctx.font = '12px sans-serif'
        ctx.fillText('contra bullets:' + data.contraBullets.length, 0, 185)
        ctx.fillText('enemy bullets:' + data.enemyBullets.length, 0, 200)
        ctx.fillText('entity:' + data.updates.length, 0, 215)


        newUpdates.forEach((entity) => {
          drawBoard(ctx, entity, 'red', 2)
        })

        data.groundCoordinates.forEach(ground => {
          const h = ground.h;
          drawLine(ctx, 
            ground.start + deltaX, h, ground.end + deltaX, h, 
            ground.type === 'land' ? 'red' : 'green', 
          )
        })
      }

    }
  }

  const foo = renderMap[type]
  foo && foo();
}
