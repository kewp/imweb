import { createButton } from './button.js';
import { flexRow } from '../layout/layout.js';

export function highLevelButton(label, width, height, onClick) {
  const button = createButton(label, 0, 0, width, height, onClick);

  return {
    width,
    height,
    render(ctx, x, y) {
      flexRow([button], { padding: 5 }).render(ctx);  // Button with padding inside a row
    }
  };
}