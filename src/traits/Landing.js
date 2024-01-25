
export class Landing {
  constructor(opts = {}) {
    this.groundCoordinates = opts.groundCoordinates;
    this.velocity = opts.velocity || 1;
  }

  getLandingResult(x, y1, y2, data) {
    for (let i = 0; i < this.groundCoordinates.length; i++) {
      const land = this.groundCoordinates[i];
      const { type, start, end, h } = land;
      if ((x >= (start + data.deltaX)) && (x <= (end + data.deltaX))) {
        if (y1 <= h && y2 >= h) {
          return { type: true, h, land };
        }
      }
    }
    return { type: false };
  }
  

  update(entity, keyboard, animations, data) {
    const y = entity.y + entity.height;
    const nextY = y + entity.speedY
    const landingResult = this.getLandingResult(entity.x, y, nextY, data)
    if (entity.jumpping || entity.falling) {
      if (landingResult.type) {
        entity.landed(landingResult.h, landingResult.land);
      }
    } else {
      if (!landingResult.type) {
        entity.setFall && entity.setFall();
      }
    }
  }
}