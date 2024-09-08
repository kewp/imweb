let mouseX = 0, mouseY = 0, isMouseClicked = false;

export function setupInput(canvas) {
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener('mousedown', () => { isMouseClicked = true; });
  canvas.addEventListener('mouseup', () => { isMouseClicked = false; });
}

export function getMousePosition() {
  return { mouseX, mouseY };
}

export function isClicked() {
  return isMouseClicked;
}