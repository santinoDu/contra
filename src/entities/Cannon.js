import { Entity } from './Entity'
import { getTime } from '@/utils/'
import { GunN } from '@/guns/GunM';


export class Cannon extends Entity{
  constructor(data, config) {
    super()
    
    this.speedX = 0;
    this.buffer = data.enemySprite.animations.cannon[0];
    this.width = this.buffer.width
    this.height = this.buffer.height;
    this.config = config;
    this.x = data.deltaX + config.x - this.width;
    this.y = config.y - this.height;
    this.type = 2;
    this.name = 'cannon'
    this.hp = 5;
    this.score = 5;
    this.data = data;
    this.audio = data.source.soundEffects.audio
    this.startBulletTime = getTime();
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
    const newList = data.enemyBullets.concat(GunN(data, this, 180));
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

    this.x = data.deltaX + this.config.x;
    if (!data.inScreen(this)) {
      this.destory();
    }
   
    ctx.drawImage(this.buffer, this.x, this.y)
  }

}