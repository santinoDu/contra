// 检测碰撞
export function checkCollision(rect1, rect2) {
  return rect1.width && rect1.height &&
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y;
}

export function entityInScreen(width, height) {
  return function(context) {
    if (context.x >= 0 && context.x < width
      && context.y >= 0 && context.y < height) {
      return true
    }
    return false
  }
}


export function animation({
  ctx,
  img,
  imgWidth,
  imgHeight,
  startPos: {x: startX, y: startY},
  endPos: {x: endX, y: endY},
  duration,
  rect,
  done
}) {
  const startTime = performance.now();
  return function draw() {
    const elapsed = performance.now() - startTime;
    const resetRect = rect || [imgWidth, imgHeight];
    const progress = Math.min(elapsed / duration, 1)
    const x = startX + (endX - startX) * progress;
    const y = startY + (endY - startY) * progress;
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight, x, y, ...resetRect);
    if (progress < 1) {
      //
    } else {
      done && done();
    }
  }
}

export function updateAnimation() {

}

export const blink = ({
  draw,
  interval = 500,
  duration,
  done
}) => {
  const startTime = performance.now();
  return function () {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1)
    if (progress < 1) {
      const visible = Math.floor(elapsed / interval) % 2
      if (visible) {
        draw()
      }
    } else {
      done && done();
    }
  }
}

export const getTime = () => window.performance.now();

export const drawLifes = (ctx, data) => {
  const lifeBuffer = data.contraSpirte.animations.life[0];
  const startX = 20;
  const startY = 20;
  const deltaX = 16;
  const lifes = Math.min(data.lifes, 4);
  Array(lifes).fill(0).forEach((_, index) => {
    ctx.drawImage(lifeBuffer, startX + deltaX * index, startY);
  })
}

export const getNewEntity = (updates) => {
  const newUpdates = []
  for (let i = 0; i < updates.length; i++) {
    let entity = updates[i];
    if (entity.remove) {
      if (entity.destory) {
        entity.destory();
      }
      entity = null;
    } else {
      newUpdates.push(entity);
    }
  }
  return newUpdates;
}

export const getFrameIndex = (startTime, interval) => {
  return Math.floor(((getTime() - startTime) / interval) % frames.length)
}


export const screenFit = (canvas, windowWidth, windowHeight, canvasWidth, canvasHeight) => {
  const canvasRatio = canvasWidth / canvasHeight;
  const windowRatio = windowWidth / windowHeight;
  let scale
  let deltaX = 0
  if (canvasRatio > windowRatio) {
    scale = windowWidth / canvasWidth;
  } else {
    scale = windowHeight / canvasHeight;
    deltaX = Math.floor((windowWidth - canvasWidth * scale) / 2);
  }
  // 变换顺序
  canvas.style.transform = `translate3d(${deltaX}px, 0, 0) scale3d(${scale}, ${scale}, 1)`;
}
