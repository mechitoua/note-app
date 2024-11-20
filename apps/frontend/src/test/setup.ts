import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { mockAnimationsApi } from 'jsdom-testing-mocks';
import { afterEach, vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.crypto
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: vi.fn().mockReturnValue('mocked-uuid'),
  },
  writable: true,
});

// Mock animations API
mockAnimationsApi();

// Cleanup after each test
afterEach(() => {
  cleanup();
});
