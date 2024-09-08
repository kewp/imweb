import { setupCanvas } from './core/canvas.js';
import { render } from './core/rendering.js';
import { setupInput } from './core/input.js';
import { resetLayout, vStack } from './core/layout.js';
import { createButton } from './components/button.js';
import { createSlider } from './components/slider.js';

const ctx = setupCanvas(800, 600);
setupInput(ctx.canvas);

let components = [
  createButton('Click Me', 50, 50, 150, 50),
  createSlider(0, 100, 50, 50, 150, 200, 10)
];

function mainLoop() {
  resetLayout();
  render(ctx, components, 800, 600);
  requestAnimationFrame(mainLoop);
}

mainLoop();