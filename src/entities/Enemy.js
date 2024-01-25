import { Entity } from './Entity';


export function createEnemyFactory(opts) {

  return (config) => {

    const enemy = new Entity();
    enemy.x = config.x;
    enemy.y = config.y;
    enemy.type = 2;

    enemy.update = (ctx, keyboard, data) => {
      ctx.drawImage(data.enemySprite.animations.birdman, enemy.x, enemy.y)
    }

  }
}