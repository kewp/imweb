To split your immediate mode canvas library in a way that allows the option to use a **modern web-like approach**
(i.e., a hierarchy of components with layout instructions such as padding, alignment, and flexbox-like behavior),
you can take a **layered approach** where the modern web paradigm sits on top of a **generic core** that handles
low-level rendering and interactions.

Here’s a way to design the library with **separation of concerns** while allowing flexibility:

### 1. **Core Layer** (Immediate Mode)
This layer will be the **generic code** that handles:
- Low-level **rendering** (drawing shapes, text, etc.).
- **Input handling** (mouse clicks, movement, etc.).
- **Basic component rendering** (without layout management).

This will be a thin, flexible layer that doesn’t assume any layout system or component hierarchy.
It will act as the foundation for both immediate mode and modern approaches.

#### `/core/rendering.js`
```javascript
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
```

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

### 2. **Component Layer** (Low-Level Components)
At this layer, you create **basic components** like buttons, sliders, and text inputs.
These components don't worry about layout or alignment, but just rendering and handling user interaction.

#### `/components/button.js`
```javascript
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
```

### 3. **Modern Layout Layer** (Hierarchy, Layout, and Styling)
This layer adds **layout management, padding, alignment, and component hierarchies** on top of the low-level components.
You can think of it as the "modern" approach to managing UIs, like how React handles component nesting and layout styling.

#### Layout and Styling Abstraction:
Define basic layout behaviors (flexbox-like, grid, padding, margin).
Each component should declare its desired layout (padding, alignment, etc.) and then the layout system will
position components accordingly.

#### `/layout/layout.js`
```javascript
export function flexRow(children, options = {}) {
  const { spacing = 10, padding = 0 } = options;
  let xOffset = padding;

  return {
    render(ctx) {
      children.forEach(child => {
        child.render(ctx, xOffset, padding);
        xOffset += child.width + spacing;
      });
    }
  };
}

export function flexColumn(children, options = {}) {
  const { spacing = 10, padding = 0 } = options;
  let yOffset = padding;

  return {
    render(ctx) {
      children.forEach(child => {
        child.render(ctx, padding, yOffset);
        yOffset += child.height + spacing;
      });
    }
  };
}
```

### 4. **Component Hierarchy Example**
Now that we have a layout system, we can define **high-level components** that use layout instructions (flexbox, padding, etc.)
and nest components in a hierarchy.

#### `/components/highLevelButton.js`
```javascript
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
```

### 5. **Theming and Styling Layer**
Allow components to declare layout and style properties via a global theme or inline component styles.
This layer enables modern design elements like colors, fonts, borders, and responsive behavior.

#### `/themes/theme.js`
```javascript
export const theme = {
  button: {
    color: '#007BFF',
    hoverColor: '#0056b3',
    textColor: '#FFFFFF',
    font: '16px Arial',
    padding: 10,
  },
  layout: {
    spacing: 10,
    padding: 15,
  }
};
```

### 6. **Example: Combining Immediate Mode with Modern Layout**
In this final structure, you can now easily create both **immediate mode components** and **hierarchically structured components**
that use layouts.

#### `/index.js`
```javascript
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
```

### Final Structure Breakdown:
- **Core Layer**: Low-level rendering and input handling. It has no knowledge of layouts or component hierarchies.
- **Component Layer**: Components like buttons, sliders, and text inputs are built on top of the core layer and are reusable.
They don’t assume any layout.
- **Layout and Modern Layer**: This layer adds the ability to position and align components in rows, columns, or grids,
mimicking a modern web approach (like Flexbox or Grid). It wraps the low-level components and allows them to be used in complex layouts.
- **Theming and Styling**: Components use a global or inline theme for customizing appearance, such as padding, font sizes, colors, etc.

### Conclusion:
This design allows you to **mix and match approaches**. You can still use a raw **immediate mode** style for certain UI elements,
but also **build modern, hierarchical UIs** with layout instructions on top of that core. The flexibility comes from isolating
low-level rendering logic from high-level layout management, which gives you the option to scale and structure the UI however you want.