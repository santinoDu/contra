import { enemiesPos } from '@/background/'
import { Birdman } from '@/entities/Birdman';
import { Cannon } from '@/entities/Cannon';
import { Runningman } from '@/entities/Runningman';
import { Gunner } from '@/entities/Gunner';
import { Kun } from '@/entities/Kun';

export const enemyController = (() => {
  let start = 0;
  return (data) => {
    const updates = data.updates;
    let needUpdate = false;
    for (let i = start; i < enemiesPos.length; i++) {
      const enemy = enemiesPos[i];
      if (enemy.x <= data.width - data.deltaX) {
        let entity = null;
        switch (enemy.type) {
          case 'eagle':
            entity = data.createEagles(enemy.bulletType);
            break;
          case 'cannon':
            entity = new Cannon(data, enemy);
            break;
          case 'birdman':
            entity = new Birdman(data, enemy)
            break;
          case 'runningman': 
            entity = new Runningman(data, enemy)
            break;

          case 'gunner':
            entity = new Gunner(data, enemy)
            break;

          case 'kun':
            entity = new Kun(data, enemy)
            break;
          default:
            break;
        }
        if (entity) {
          updates.push(entity)
          needUpdate = true;
        }
        start = i + 1;
      }
    }

    if (needUpdate) {
      data.mainData$.next({
        updates: updates,
      });
    }
  }
})()