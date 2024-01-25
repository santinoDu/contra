import { getTime } from '@/utils';

export class Jump {
  constructor({frames}) {
    this.ready = 0;
    this.startTime = 0;
    this.interval = 100;
    this.velocity = 0.4;
    this.frames = frames;
    this.framesLen = frames.length;
  }

  start(entity, speedY) {
    if (!entity.jumpping) {
      entity.sounds.playAudio('jumpping');
      entity.jumpping = true;
      entity.speedY = speedY || -5.5;
      this.startTime = getTime();
    }
  }

  getFrame() {
    const deltaTime = getTime() - this.startTime;
    const actionIndex = Math.floor(deltaTime / this.interval);
    const frameIndex = actionIndex % this.framesLen;
    return this.frames[frameIndex];
  }

  update(entity) {
    if (entity.jumpping) {
      entity.y += entity.speedY;
      entity.speedY += this.velocity;
    }

    // if (entity.y > 500) {
    //   entity.y = 500
    //   entity.jumpping = false;
    // }
  }
}