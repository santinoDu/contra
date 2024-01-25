import { Entity } from './Entity'
import { getTime } from '@/utils/'
import { GunN } from '@/guns/GunM';


export class Kun extends Entity{
  constructor(data, config) {
    super()
    this.speedX = 0;
    this.speedY = 2;
    this.delta = 20;
    this.buffer = data.kunSprite.animations.run[0];
    this.width = this.buffer.width
    this.height = this.buffer.height;
    this.basket = data.kunSprite.animations.basketball[0]

    this.x = data.deltaX + config.x - this.width;
    this.y = config.y - 1;

    this.type = 2;
    this.name = 'kun'
    this.hp = 250;
    this.score = 10;
    this.data = data;
    this.audio = data.source.soundEffects.audio
    this.startMoveTime = getTime()
    this.startBulletTime = getTime();
    this.moveInterval = 2000;
    this.nextMoveInterval = 2500;
    this.bulletInterval = 1000;
    this.scored = false;
    this.now = getTime();
    this.skills = {
      chang: {
        cd: 5000,
        audio: 'jntm',
      },
      tiao: {
        cd: 4000,
        audio: 'tiao',
      },
      rap: {
        cd: 1000,
        audio: 'ji'
      },
      lanqiu: {
        cd: 10000,
        audio: 'lanqiu'
      }
    }
    console.log('ikun')
    this.audio.playAudio('jntm');

  }


  destory() {
    this.remove = true;
    this.data.source.mainTitle.music.pauseAll();
    this.audio.playAudio('ngmhhy');
    setTimeout(() => {
      this.audio.playAudio('missioncomplete');
    }, 4000)
  }

  hurt(damage, callback) {
    this.audio.playAudio('ay');
    this.hp -= damage * 2;
    if (this.hp <= 0) {
      if (!this.scored) {
        callback();
        this.scored = true;
      }
      this.destory();
    }
  }

  shot(data) {
    this.audio.playAudio('ji');
    const newList = data.enemyBullets.concat(GunN(data, this, null, this.basket));
    data.mainData$.next({
      enemyBullets: newList,
    });
  }

  getKill () {
    // const skills = 
  }

  update(ctx, keyboard, data) {
    const contra = data.contra;
    this.face = this.x > contra.x ? 'left' : 'right';
    const skill = this.getKill();
    const now = getTime()
    if (now - this.startBulletTime > this.bulletInterval) {
      this.startBulletTime = now;
      this.shot(data);
    }
    const moveTime = now - this.startMoveTime
    if (moveTime > this.moveInterval && moveTime < this.nextMoveInterval) {
      this.speedX = 0;
    } else if (moveTime > this.nextMoveInterval) {
      this.startMoveTime = now;

      const random = Math.floor(Math.random() * this.half);
      const delta = Math.min(random, this.half / 2)
      const targetX = (this.x < this.half) ? this.x + delta : this.x - delta;
      this.speedX = Math.floor((targetX - this.x) / (this.moveInterval / data.FPS) / 2);
    }

    // this.x += this.speedX;
   
    ctx.drawImage(this.buffer, this.x, this.y)
  }

}