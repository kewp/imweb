let yOffset = 0;

export function resetLayout() {
  yOffset = 10;  // Reset position for a new frame
}

export function vStack(component, spacing = 10) {
  const position = { x: 10, y: yOffset };
  yOffset += component.height + spacing;
  return position;
}