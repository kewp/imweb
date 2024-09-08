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