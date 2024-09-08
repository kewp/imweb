import { getMousePosition, isClicked } from '../core/input.js';
import { theme } from '../themes/theme.js';

export function createButton(label, x, y, width, height) {
  return {
    width, height,
    render(ctx) {
      const { mouseX, mouseY } = getMousePosition();
      const isHovered = mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height;

      ctx.fillStyle = isHovered ? theme.button.hoverColor : theme.button.color;
      ctx.fillRect(x, y, width, height);

      ctx.fillStyle = theme.button.textColor;
      ctx.font = theme.button.font;
      ctx.fillText(label, x + 10, y + 30);

      if (isHovered && isClicked()) {
        console.log(`${label} clicked!`);
      }
    }
  };
}