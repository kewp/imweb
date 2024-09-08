import { setupCanvas } from './core/canvas.js';
import { setupInput } from './core/input.js';
import { highLevelButton } from './components/highLevelButton.js';
import { flexColumn } from './layout/layout.js';

const ctx = setupCanvas(800, 600);
setupInput(ctx.canvas);

// Create high-level buttons with modern layouts
const button1 = highLevelButton('Click Me 1', 150, 50, () => console.log('Button 1 clicked'));
const button2 = highLevelButton('Click Me 2', 150, 50, () => console.log('Button 2 clicked'));

// Use flexbox-like column layout
const ui = flexColumn([button1, button2], { spacing: 20, padding: 20 });

function mainLoop() {
  ctx.clearRect(0, 0, 800, 600);
  ui.render(ctx);
  requestAnimationFrame(mainLoop);
}

mainLoop();