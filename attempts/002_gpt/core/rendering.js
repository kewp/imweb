export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function drawRect(ctx, x, y, width, height, color = '#000') {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

export function drawText(ctx, text, x, y, font = '16px Arial', color = '#000') {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.fillText(text, x, y);
}