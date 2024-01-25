// const gunMCanvas = createCanvas(contra.url, frame);
import { getAngle } from '@/utils/math'
const directionMap = {
  top: 90,
  bottomRight: 315,
  right: 0,
  topRight: 45,
  bottom: 270,
  topLeft: 135,
  left: 180,
  bottomLeft: 225,
}


// console.log('bullet$.next', bullet$.next)

// export const shot$ = bullet$;

const createGunM = (opts) => {
  
}



export class GunM {
  constructor({ctx, buffer, direction, speed, name, angle, x, y, canvasWidth, canvasHeight}) {
    this.ctx = ctx;
    this.buffer = buffer;
    this.direction = direction;
    this.x = x;
    this.y = y;
    this.name = name;
    this.width = this.buffer.width
    this.height = this.buffer.height
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.speed = speed || 10;
    this.angle = angle || directionMap[direction || 'right'];
    this.radians = this.angle * Math.PI / 180
    this.damage = 1;
    this.remove = false;
    // this.update();

  }

  get rect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }

  update() {
    this.x += this.speed * Math.cos(this.radians);
    this.y += -this.speed * Math.sin(this.radians)
    if (this.x > 0 && this.x < this.canvasWidth && this.y > 0 && this.y < this.canvasHeight) {
      this.ctx.drawImage(this.buffer, this.x, this.y)
      // window.requestAnimationFrame(() => this.update())
    } else {
      this.remove = true;
    }
  }
}

export const GunS = (opts) => {
  const angle = directionMap[opts.direction || 0];
  const detal = 15
  const angles = [-2, -1, 0, 1, 2].map(key => angle + key * detal);
  return angles.map(angle => {
    return new GunM({...opts, angle});
  })
}

export const GunN = (data, enemy, direction, buffer) => {
  const contra = data.contra;
  const angle = direction || getAngle(enemy.x, enemy.y, contra.x, contra.y);
  return new GunM({
    angle,
    buffer: buffer || data.contraSpirte.tiles.gunN,
    x: enemy.x,
    y: enemy.y,
    speed: 3,
    name: enemy.name,
    ctx: data.ctx, 
    canvasWidth: data.canvasWidth,
    canvasHeight: data.canvasHeight
  });
}
