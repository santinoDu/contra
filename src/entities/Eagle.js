import { Entity } from './Entity'
import { Landing } from '@/traits/landing'

export const createEagle = function(data) {
  const buffers = data.eagle.tiles;
  return (type) => {
    return new Eagle(buffers, type, data)
  }
}

export class Eagle extends Entity{
  constructor(buffers, weaponType = 2, data) {
    super()
    this.speedX = 2.5;
    this.speedY = -2;
    this.x = 0;
    this.y = 40;
    this.originY = this.y;
    this.delta = 20;
    this.buffers = buffers;
    this.buffer = buffers.origin;
    this.weaponType = weaponType
    this.gunBuffer = weaponType === 2 ? buffers.eagleS : buffers.eagleM;
    this.width = 25
    this.height = 15;
    this.type = 2;
    this.status = 2;
    this.name = 'weapon'
    this.falling = true;
    this.data = data;
    this.addTrait('landing', new Landing({
      groundCoordinates: data.groundCoordinates
    }))
  }

  landed(h) {
    this.y = h - this.height;
    this.speedY = 0;
    this.falling = false;

  }

  airborne() {
    this.status = 1;
    this.deltaX = this.data.deltaX;
  }
  

  update(ctx, keyboard, data) {
    if (this.status > 0) {
      if (this.falling) {
        this.x += this.speedX; 
        this.y += this.speedY;
      }
      
      this.remove = !data.inScreen(this);
      if (this.status === 2) {
        if (Math.abs(this.y - this.originY) > this.delta) {
          this.speedY *= -1;
        }
      } else if (this.status === 1) {
        this.speedX = 0;
        this.speedY = 3;
        // this.y = 500;
        this.x += data.deltaX - this.deltaX
        this.deltaX = data.deltaX;

        this.buffer = this.gunBuffer;
        this.getTrait('landing').update(this, keyboard, null, data);
      }
      ctx.drawImage(this.buffer, this.x, this.y)
    }
    
  }

  destory() {
    this.status = 0;
    this.remove = true;
  }

}