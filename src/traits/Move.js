import { getTime } from '@/utils';

export class Move {
  constructor() {
    this.startTime = 0;
    this.interval = 100;
    this.speed = 2;
    this.velocity = 1;
    this.lastDirectionValue = 3;
  }

  start(entity) {
    
  }

  getFrame(buffers) {
    const deltaTime = getTime() - this.startTime;
    const actionIndex = Math.floor(deltaTime / this.interval);
    const frameIndex = actionIndex % buffers.length;
    return buffers[frameIndex];
  }

  update(entity, keyboard, animations) {
    const directionValue = keyboard.directionValue
    this.direction = keyboard.direction
    if (directionValue >= 2) {
      entity.x += this.speed;
    } else if (directionValue <= -2) {
      entity.x -= this.speed;
    }
    if (directionValue !== this.lastDirectionValue) {
      this.lastDirectionValue = directionValue;
      this.startTime = getTime();
    } 
    
  }
}