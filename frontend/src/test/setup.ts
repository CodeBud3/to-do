/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { vi } from "vitest";
// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

const listeners: any = {};
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => {
    console.log("Inside mock window matchmedi");
    return {
      matches: false, // Change to true if you need to test dark mode or other conditions
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated method
      removeListener: vi.fn(), // Deprecated method
      addEventListener: (event: any, cb: any) => {
        listeners[event] = cb;
      },
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  }),
});

Object.defineProperty(window, "addEventListener", {
  writable: true,
  value: vi.fn(),
});

export class MockPointerEvent extends Event {
  button: number | undefined;
  ctrlKey: boolean | undefined;

  constructor(type: any, props: any) {
    super(type, props);
    if (props.button != null) {
      this.button = props.button;
    }
    if (props.ctrlKey != null) {
      this.ctrlKey = props.ctrlKey;
    }
  }
}
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
