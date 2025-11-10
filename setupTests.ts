import '@testing-library/jest-dom';

// Minimal ResizeObserver mock for jsdom
class ResizeObserver {
  observe(_target?: Element) {}
  unobserve(_target?: Element) {}
  disconnect() {}
}

// attach to globalThis so it works in vitest environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).ResizeObserver = ResizeObserver;

// Polyfill missing pointer events for jsdom (fixes Radix UI error)
if (typeof Element !== 'undefined') {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
}

if (typeof window !== 'undefined') {
  Element.prototype.scrollIntoView = () => {};
}
