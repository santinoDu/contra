export const createCanvas = (image, w, h) => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', w)
  canvas.setAttribute('height', h)
  return canvas;
}

export function drawLine(ctx, x1, y1, x2, y2, color, lineWidth = 1) {
  if (color) {
    ctx.strokeStyle = color;
  }

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.lineWidth = lineWidth;
}

export const drawBoard = (ctx, rect, color, lineWidth = 1) => {
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.width, rect.height);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

export const fillRect = (ctx, x, y, width, height, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

export const drawHpBar = (ctx, hp, data) => {
  if (hp > 0) {
    const colors = ['red', 'yellow', 'blue', 'green', 'red'];
    const barWidth = 100;
    const barHeight = 5;
    const divisor = 10;
    const quotient = Math.floor(hp / divisor);
    const remainder = hp % divisor
    const width = data.width;
    const mod = quotient % 4
    const startWidth = width - barWidth - 10
    const rect1 = [startWidth, 10, barWidth, barHeight]
    const rect2 = [startWidth, 10, barWidth * remainder / divisor , barHeight]
  
    fillRect(ctx, ...rect1, 'black');
    if (quotient > 0) {
      fillRect(ctx, ...rect1, colors[mod]);
    }
    fillRect(ctx, ...rect2, colors[mod + 1]);
    if (quotient > 0) {
      ctx.fillStyle = '#fff'
      ctx.fillText('x ' + quotient, startWidth, 30)
    }
  }
  
} 
