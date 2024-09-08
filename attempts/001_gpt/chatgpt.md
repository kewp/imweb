Structuring a **canvas-based immediate mode UI library** to include all the features of a modern web app requires a modular,
scalable approach that separates concerns like rendering, input handling, layout management, and theming.
Here’s how you could structure it:

### 1. **Core Structure**
Start by creating a basic directory structure to organize different aspects of the library:

```
/src
  /core
    canvas.js        # Core canvas setup and main loop
    rendering.js     # Core rendering logic (clear canvas, redraw, etc.)
    input.js         # Mouse, keyboard, and focus handling
    layout.js        # Layout system (flex, grid, etc.)
  /components
    button.js        # Button component (render, handle clicks, etc.)
    slider.js        # Slider component (handle mouse drag, etc.)
    textInput.js     # Text input component
    checkbox.js      # Checkbox component
  /themes
    theme.js         # Global theme variables for colors, fonts, etc.
  /utils
    easing.js        # Easing functions for animations
    shapes.js        # Utility functions (rounded rectangles, shadows, etc.)
  index.js            # Main entry point
```

### 2. **Core Canvas Setup**
This module handles initializing the canvas and setting up the main rendering loop.

#### `/core/canvas.js`
```javascript
export function setupCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  return canvas.getContext('2d');
}
```

### 3. **Rendering Engine**
The **rendering.js** file manages the canvas clearing, drawing, and updating components every frame.

#### `/core/rendering.js`
```javascript
export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function render(ctx, components, width, height) {
  clearCanvas(ctx, width, height);
  components.forEach(component => component.render(ctx));
}
```

### 4. **Input Handling**
Manage mouse and keyboard input globally and expose event handlers to UI components.

#### `/core/input.js`
```javascript
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
```

### 5. **Layout Management**
Provide helper functions for arranging components in a layout (like Flexbox or Grid). This module calculates positions dynamically.

#### `/core/layout.js`
```javascript
let yOffset = 0;

export function resetLayout() {
  yOffset = 10;  // Reset position for a new frame
}

export function vStack(component, spacing = 10) {
  const position = { x: 10, y: yOffset };
  yOffset += component.height + spacing;
  return position;
}
```

### 6. **Reusable Components**
Each UI component will have its own file, where it handles rendering, input detection, and interaction.
Components can follow this structure:

#### `/components/button.js`
```javascript
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
```

#### `/components/slider.js`
```javascript
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
```

### 7. **Global Theme**
Theming allows developers to customize the look of the UI. Create a file for global theme variables like colors, fonts, and styles.

#### `/themes/theme.js`
```javascript
export const theme = {
  button: {
    color: '#007BFF',
    hoverColor: '#0056b3',
    textColor: '#FFFFFF',
    font: '16px Arial',
  },
  slider: {
    color: '#ccc',
    handleColor: '#333',
  }
};
```

### 8. **Utility Functions**
Utility functions can handle common tasks like drawing rounded rectangles, animations, and shadows.
These keep your code DRY and reusable.

#### `/utils/shapes.js`
```javascript
export function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}
```

#### `/utils/easing.js`
```javascript
export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
```

### 9. **Putting It All Together**
In your main entry file, use the components, core, and theme together to create the final application.

#### `/index.js`
```javascript
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
```

### Summary of the Structure:

- **/core**: Contains core functionalities like input handling, rendering, layout management, and canvas setup.
- **/components**: Each UI component (buttons, sliders, etc.) is modular, handling its own rendering and interaction.
- **/themes**: A global theme system for styling.
- **/utils**: Utility functions for common tasks like drawing shapes, animations, etc.

This structure provides flexibility for expanding the library by adding new components or features while keeping each aspect
modular and reusable.