import { levelOneSource, audioSource } from '@/config/audio';
import imageGround from '@/assets/images/ground.png';
import imageFloatStone from '@/assets/images/stone.jpg';
import imageMountains from '@/assets/images/mountains.jpg';
import startScene from '@/assets/images/loading.png';
import contraUrl from '@/assets/images/contra.png';
import bulletsUrl from '@/assets/images/bullets.png';
import backgroundUrl from '@/assets/images/level-1.jpg';

export const level_1 = {
  audios: audioSource,
  music: levelOneSource,
  layers: {
    background: backgroundUrl,
    sprite: [
      {
        name: 'mainSprite',
        image: contraUrl,
      },
      {
        name: 'bullets',
        image: bulletsUrl,
      }
    ],
    tiles: [
      {
        name: 'mountains',
        image: imageMountains,
        position: [
          [50, 200, 2],
        ]
      },
      {
        name: 'ground',
        image: imageGround,
        position: [
          [0, 600, 100], // 第三个参数为渲染数量
        ]
      },
      {
        name: 'start',
        image: startScene,
        position: [
          [0, 0], // 第三个参数为渲染数量
        ]
      },
      
      // {
      //   style: 'ground',
      //   image: imageFloatStone,
      //   position: [
      //     [50, 200],
      //   ]
      // },
      
    ]
  }
}