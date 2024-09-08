import { getMousePosition, isClicked } from '../core/input.js';

export function createSlider(min, max, value, x, y, width, height) {
  return {
    width, height,
    render(ctx) {
      const { mouseX, mouseY } = getMousePosition();
      const sliderPos = ((value - min) / (max - min)) * width;

      ctx.fillStyle = '#aaa';
      ctx.fillRect(x, y, width, 10);

      ctx.fillStyle = '#333';
      ctx.fillRect(x + sliderPos - 5, y - 5, 10, 20);

      if (mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height && isClicked()) {
        value = min + ((mouseX - x) / width) * (max - min);
      }
    }
  };
}