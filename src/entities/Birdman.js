import { Entity } from './Entity'
import { getTime } from '@/utils/'
import { GunN } from '@/guns/GunM';


export class Birdman extends Entity{
  constructor(data, config) {
    super()
    this.speedX = 0;
    this.delta = 20;
    this.buffer = data.enemySprite.animations.birdman[0];
    this.width = this.buffer.width
    this.height = this.buffer.height;
    this.x = data.width - 50;
    this.y = config.y - 1;
    this.originY = this.y;
    this.half = data.width / 2;
    this.type = 2;
    this.name = 'birdman'
    this.hp = 50;
    this.score = 10;
    this.data = data;
    this.audio = data.source.soundEffects.audio
    this.startMoveTime = getTime()
    this.startBulletTime = getTime();
    this.moveInterval = 2000;
    this.nextMoveInterval = 2500;
    this.bulletInterval = 1000;
    this.scored = false;
  }


  destory() {
    this.remove = true;
  }

  hurt(damage, callback) {
    this.audio.playAudio('beshotted');
    this.hp -= damage;
    if (this.hp <= 0) {
      if (!this.scored) {
        callback();
        this.scored = true;
      }
      this.destory();
    }
  }

  shot(data) {
    const newList = data.enemyBullets.concat(GunN(data, this));
    data.mainData$.next({
      enemyBullets: newList,
    });
  }

  update(ctx, keyboard, data) {
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

    this.x += this.speedX;

    if (!data.inScreen(this)) {
      this.destory();
    }
   
    ctx.drawImage(this.buffer, this.x, this.y)
  }

}