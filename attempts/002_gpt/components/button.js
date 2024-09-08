import { drawRect, drawText } from '../core/rendering.js';
import { getMousePosition, isClicked } from '../core/input.js';

export function createButton(label, x, y, width, height, onClick) {
  return {
    render(ctx) {
      const { mouseX, mouseY } = getMousePosition();
      const isHovered = mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height;

      drawRect(ctx, x, y, width, height, isHovered ? '#555' : '#333');
      drawText(ctx, label, x + 10, y + 25, '16px Arial', '#fff');

      if (isHovered && isClicked() && onClick) {
        onClick();
      }
    }
  };
}