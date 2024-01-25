import { from, map, mergeAll, reduce, scan, tap
} from 'rxjs';
import { loadImage } from './image';
import { level_1 } from '@/levels/level_1';
import { loadAudioBoard } from '@/loaders/audioBoard'
import { LOAD_SOURCE } from '@/types';
import { createBuffers } from '@/loaders/sprite';
import { enemySprite } from '@/sprite/enemy'


function createImageBuffer(image) {
  const buffer = document.createElement('canvas');
  buffer.width = image.width;
  buffer.height = image.height;
  const context = buffer.getContext('2d');
  context.drawImage(image, 0, 0);
  return buffer;
}

export function loaderLevel(level) {
  const {
    music,
    layers,
    audios,
  } = level_1;
  const tilesObservable = [...layers.tiles.map(item => {
    return loadImage(item.image).pipe(
      map(image => {
        return {
          image,
          name: item.name,
          width: image.width,
          height: image.height,
          position: item.position,
          buffer: createImageBuffer(image),
        }
      }),
      map(image => ({
        ...image,
        type: 'image'
      }))
    )
  })]

  const spriteObservable = [...layers.sprite.map(item => {
    return loadImage(item.image).pipe(
      map(image => ({
        image,
        name: item.name,
        type: 'sprite'
      }))
    )
  })]

  const backgroundObservable = [
    loadImage(layers.background).pipe(
      map(image => {
        return {
          image,
          buffer: createBuffers(image, 0, 0, 0, image.width, image.height),
          width: image.width,
          height: image.height,
          name: 'background',
          type: 'background'
        }
      })
    )
  ]

  const enemyObservable = [
    loadImage(enemySprite.url).pipe(
      map(image => {
        return {
          image,
          buffer: createBuffers(image, 0, 0, 0, image.width, image.height),
          width: image.width,
          height: image.height,
          name: 'enemy',
          type: 'enemy',
          config: enemySprite
        }
      })
    )
  ]

  const levelMusic$ = from(loadAudioBoard(music)).pipe(
    map((music) => ({
      music,
      type: 'music',
      name: 'mainTitle'
    }))
  )

  const audio$ = from(loadAudioBoard(audios)).pipe(
    map((audio) => {
      return {
        audio,
        type: 'audio',
        name: 'soundEffects'
      }
    })
  )

  const levelAssets = [...tilesObservable, ...backgroundObservable, ...spriteObservable, levelMusic$, audio$]
  const assetsLength = levelAssets.length;
  let loadedCount = 0;
  return from(levelAssets).pipe(
    mergeAll(),
    map(value => {
      return {
        value,
        type: LOAD_SOURCE,
        loadedCount: ++loadedCount,
        total: assetsLength,
      }
    })
  )
}