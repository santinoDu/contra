

import { fromEvent, of, mergeMap } from 'rxjs';

export const loadImagePromise = (url) => {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    }
    image.src = url;
  })
}

export const loadImage = (url) => {
  
  const img = new Image();
  img.src = url;

  const imgLoad$ = fromEvent(img, 'load').pipe(
    mergeMap(() => {
      return of(img)
    })
  );

  return imgLoad$
}
