export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function render(ctx, components, width, height) {
  clearCanvas(ctx, width, height);
  components.forEach(component => component.render(ctx));
}