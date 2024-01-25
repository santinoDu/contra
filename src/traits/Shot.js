
export class Shot {
  constructor(opts = {}) {
    this.groundCoordinates = opts.groundCoordinates;
    this.velocity = opts.velocity || 1;
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