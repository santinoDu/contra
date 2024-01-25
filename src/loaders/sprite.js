import { loadImagePromise } from './image';
// import { SpriteSheet } from '@/sprite/SpriteSheet';

export function createAnim(frames, frameLen) {
  return function resolveFrame(distance) {
      const frameIndex = Math.floor(distance / frameLen) % frames.length;
      const frameName = frames[frameIndex];
      return frameName;
  };
}


export const createBuffers = (image, flip, x, y, width, height) => {
  const buffer = document.createElement('canvas');
  buffer.width = width;
  buffer.height = height;

  const context = buffer.getContext('2d');

  if (flip) {
      context.scale(-1, 1);
      context.translate(-width, 0);
  }

  context.drawImage(
      image,
      x,
      y,
      width,
      height,
      0,
      0,
      width,
      height);

  return buffer;
}


export const loadSprite = (spriteConfig) => {
  const {
    url,
    frames,
    animations,
    tiles,
  } = spriteConfig;
  return loadImagePromise(url)
    .then(image => {
      // const sprites = new SpriteSheet(image);
      // if (frames) {
      //   Object.keys(frames).forEach(key => {
      //     sprites.define(key, ...frames[key]);
      //   })
      // }

      return new Promise(resolve => {
        const result = Object.keys(animations).reduce((result, key) => {
          const value = animations[key];
          if (typeof value === 'string' && value.startsWith('-')) {
            result[key] = animations[value.slice(1)].map(key => {
              return createBuffers(image, true, ...frames[key]);
            });
          } else {
            result[key] = animations[key].map(key => {
              return createBuffers(image, false, ...frames[key]);
            });
          }
          return result;
        }, {});
        resolve({
          image,
          animations: result,
          tiles: Object.keys(tiles).reduce((result, key) => {
            result[key] = createBuffers(image, false, ...tiles[key])
            return result;
          }, {})
        })
      })
    });
}