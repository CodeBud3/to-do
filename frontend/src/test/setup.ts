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

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false, // Change to true if you need to test dark mode or other conditions
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated method
    removeListener: vi.fn(), // Deprecated method
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, "addEventListener", {
  writable: true,
  value: vi.fn(),
});
