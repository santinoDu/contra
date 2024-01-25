import { Entity } from './Entity'
import { getTime } from '@/utils/'
import { GunN } from '@/guns/GunM';


export class Gunner extends Entity{
  constructor(data, config) {
    super()
    this.speedX = 0;
    this.buffer = data.enemySprite.animations.shot2[0];
    this.bufferRight = data.enemySprite.animations.shotRight[0];
    this.width = this.buffer.width
    this.height = this.buffer.height;
    this.configX = config.x - this.width;
    this.x = data.deltaX + config.x - this.width;
    this.y = config.y - this.height;
    this.type = 2;
    this.name = 'gunner'
    this.hp = 1;
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

    if (!data.inScreen(this)) {
      this.destory();
    }
    this.x = data.deltaX + this.configX;
    const frame = this.x > data.contra.x ? this.buffer : this.bufferRight;
    ctx.drawImage(frame, this.x, this.y)
  }

}