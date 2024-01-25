import { Entity } from './Entity'
import { getTime } from '@/utils/'
import { Landing } from '@/traits/Landing';


export class Runningman extends Entity{
  constructor(data, config) {
    super()
    this.speedX = -2;
    this.speedY = 2;
    this.buffers = data.enemySprite.animations.runningman;
    this.bufferLength = this.buffers.length;
    this.buffer = this.buffers[0];
    this.width = this.buffer.width;
    this.height = this.buffer.height;
    this.x = config.x + data.deltaX;
    this.y = config.y - this.height;
    this.type = 2;
    this.name = 'runningman'
    this.hp = 1;
    this.score = 2;
    this.data = data;
    this.audio = data.source.soundEffects.audio
    this.startMoveTime = getTime()
    this.scored = false;
    this.addTrait('landing', new Landing({
      groundCoordinates: data.groundCoordinates
    }));
    this.lastDeltaX = data.deltaX;
  }


  destory() {
    this.remove = true;
  }

  hurt(damage, callback) {
    // this.audio.playAudio('beshotted');
    this.hp -= damage;
    if (this.hp <= 0) {
      if (!this.scored) {
        callback();
        this.scored = true;
      }
      this.destory();
    }
  }

  setFall() {
    this.y += 5;
  }

  update(ctx, keyboard, data) {
    const now = getTime()
   
    const moveTime = now - this.startMoveTime
    const frameIndex = Math.floor(moveTime / 200 % this.bufferLength);
    this.x += this.speedX - this.lastDeltaX + data.deltaX;
    this.lastDeltaX = data.deltaX;
    if (!data.inScreen(this)) {
      this.destory();
    }
    this.getAllTraits().forEach(trait => {
      trait.update(this, keyboard, this.buffers, data)
    })
   
    ctx.drawImage(this.buffers[frameIndex], this.x, this.y)
  }

}